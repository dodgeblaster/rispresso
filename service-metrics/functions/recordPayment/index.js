const AWS = require('aws-sdk')
const cloudwatch = new AWS.CloudWatch({
    region: process.env.AWS_REGION
})

module.exports.handler = async (e) => {
    const storeId = e.detail.storeId
    const amount = e.detail.amount

    const params = {
        MetricData: [
            {
                MetricName: 'Amount',
                Dimensions: [
                    {
                        Name: 'Store',
                        Value: storeId
                    }
                ],
                Unit: 'Count',
                Value: amount
            }
        ],
        Namespace: 'rispresso-payments'
    }

    await cloudwatch.putMetricData(params).promise()
}
