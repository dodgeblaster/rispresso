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
    await emit('paymentCompleted', {
        orderId: e.detail.orderId,
        storeId: e.detail.storeId,
        status: 'Payment has been successfully processed',
        products: e.detail.products,
        amount: e.detail.amount,
        customerId: e.detail.customerId,
        customerName: e.detail.customerName
    })
    return {
        orderId: e.detail.orderId,
        storeId: e.detail.storeId,
        status: 'Payment has been successfully processed',
        products: e.detail.products,
        amount: e.detail.amount,
        customerId: e.detail.customerId,
        customerName: e.detail.customerName
    }
}
