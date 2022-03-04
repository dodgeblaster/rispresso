// SOURCES
const API = 'simplerise'
const CORE = 'risesimplecore'

// EVENTS
// <-
const paymentRequested = 'paymentRequested'
const cancelPaymentRequested = 'cancelPaymentRequested'
const paymentCompleted = 'paymentCompleted'
const paymentFailed = 'paymentFailed'
const paymentCancelled = 'paymentCancelled'
const orderStarted = 'orderStarted'
const orderCompleted = 'orderCompleted'

module.exports = {
    api: {
        getOrderDetails: [
            {
                type: 'input',
                storeId: 'string',
                id: 'string'
            },
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: '!sub',
                    sk: 'order_{$id}'
                }
            }
        ]
    },
    events: {
        simplerisedev_paymentRequested: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                amount: 'number',
                product: 'string',
                author: 'string'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_details',
                    amount: '$amount',
                    product: '$product',
                    time: '$time'
                }
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_paymentRequested',
                    event: 'paymentRequested',
                    time: '$time',
                    author: '$author'
                }
            }
        ],

        simplerisedev_cancelPaymentRequested: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                amount: 'number',
                product: 'string',
                author: '!sub'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_paymentCancellationRequested',
                    event: 'paymentCancellationRequested',
                    time: '$time',
                    author: '$author'
                }
            }
        ],
        risesimplecoredev_paymentCompleted: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                status: 'string',
                amount: 'number',
                product: 'string'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_paymentCompleted',
                    event: 'paymentCompleted',
                    time: '$time'
                }
            }
        ],
        risesimplecoredev_paymentFailed: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                status: 'string'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_paymentFailed',
                    event: 'paymentFailed',
                    time: '$time'
                }
            }
        ],
        risesimplecoredev_paymentCancelled: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                status: 'string'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_paymentCancelled',
                    event: 'paymentCancelled',
                    time: '$time'
                }
            }
        ],

        simplerisedev_orderStarted: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                author: 'string'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_orderStarted',
                    event: 'orderStarted',
                    time: '$time',
                    author: '$author'
                }
            }
        ],
        simplerisedev_orderCompleted: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                author: 'string'
            },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'order_{$id}_{$time}_orderCompleted',
                    event: 'orderCompleted',
                    time: '$time',
                    author: '$author'
                }
            }
        ]
    }
}
