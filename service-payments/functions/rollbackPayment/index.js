const AWS = require('aws-sdk')
const eventbridge = new AWS.EventBridge({
    region: process.env.AWS_REGION
})

const emit = async (event, input) => {
    const params = {
        Entries: [
            {
                Detail: JSON.stringify(input),
                DetailType: event,
                EventBusName: 'default',
                Source: `custom.rispressopayments${process.env.STAGE}`,
                Time: new Date()
            }
        ]
    }

    await eventbridge.putEvents(params).promise()
}

const wait = () => new Promise((r) => setTimeout(r, 2000))

const makePayment = async (e) => {
    if (e.synth) {
        // do a bunch of logic...
        console.log('payment started')
        await wait()
    } else {
        // do a bunch of logic...
        console.log('payment started')
        await wait()
    }
}

module.exports.handler = async (e) => {
    await makePayment(e)
    await emit('cancellationCompleted', {
        orderId: e.detail.orderId,
        storeId: e.detail.storeId,
        customerId: e.detail.customerId
    })
    return {
        orderId: e.detail.orderId,
        storeId: e.detail.storeId,
        customerId: e.detail.customerId
    }
}
