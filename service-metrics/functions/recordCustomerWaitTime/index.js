const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient({
    region: process.env.AWS_REGION
})

const cloudwatch = new AWS.CloudWatch({
    region: process.env.AWS_REGION
})

const getEventTime = (list, event) =>
    Number(list.find((x) => x.event.includes(event)).time)

const calculateWaitTime = (Items) => {
    const start = getEventTime(Items, 'ORDER_PLACED')
    const end = getEventTime(Items, 'ORDER_READY')
    return end - start
}

async function writeWaitTimeMetric({ time, storeId }) {
    const params = {
        MetricData: [
            {
                MetricName: 'Time',
                Dimensions: [
                    {
                        Name: 'Store',
                        Value: storeId
                    }
                ],
                Unit: 'Milliseconds',
                Value: time
            }
        ],
        Namespace: 'rispresso-customer-wait-time'
    }

    await cloudwatch.putMetricData(params).promise()
}

const listOrdersEvents = async (storeId, orderId) => {
    const params = {
        TableName: process.env.TABLE,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
            ':pk': 'store_' + storeId,
            ':sk': 'order_' + orderId + '_event_'
        }
    }
    const res = await db.query(params).promise()
    return res.Items
}

module.exports.handler = async (e) => {
    await db
        .put({
            TableName: process.env.TABLE,
            Item: {
                PK: 'store_' + e.detail.storeId,
                SK: 'order_' + e.detail.orderId + '_event_' + e.detail.time,
                time: e.detail.time,
                orderId: e.detail.orderId,
                orderId: e.detail.orderId,
                customerId: e.detail.customerId,
                event: e.detail.event
            }
        })
        .promise()

    if (e.detail.event === 'ORDER_READY') {
        const allEvents = await listOrdersEvents(
            e.detail.storeId,
            e.detail.orderId
        )
        const waitTime = calculateWaitTime(allEvents)
        await writeWaitTimeMetric({
            time: waitTime,
            storeId: e.detail.storeId
        })
    }
}
