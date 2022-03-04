// EVENTS

// ->
const paymentRequested = 'paymentRequested'
const cancelPaymentRequested = 'cancelPaymentRequested'

// <-
const paymentCompleted = 'paymentCompleted'
const paymentFailed = 'paymentFailed'
const paymentCancelled = 'paymentCancelled'

//store_1e5973dc-e7b7-4fbb-8f4e-7b346a8bf7b1
// 6b73b9dd-7673-4aa6-8c13-9133e05d10d8

const STORE_HAS_CAPACITY = {
    type: 'guard',
    pk: '$storeId',
    sk: 'open'
}

module.exports = {
    api: {
        makePayment: [
            {
                type: 'input',
                storeId: 'string',
                amount: 'number',
                product: 'string'
            },

            STORE_HAS_CAPACITY,
            {
                type: 'add',
                id: '@id',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '!sub',
                    sk: 'payment_{$id}_details',
                    store: '$storeId',
                    amount: '$amount',
                    product: '$product',
                    time: '$time'
                }
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    store: '$storeId',
                    status: 'requested',
                    details: 'Payment has been requested'
                }
            },
            {
                type: 'emit',
                event: 'paymentRequested',
                input: {
                    id: '$id',
                    storeId: '$storeId',
                    amount: '$amount',
                    product: '$product',
                    customer: '!sub'
                }
            }
        ],
        cancelPayment: [
            {
                type: 'input',
                storeId: 'string',
                id: 'string',
                amount: 'number',
                product: 'string'
            },

            // {
            //     type: 'guard',
            //     pk: '$storeId',
            //     sk: 'order_{$id}_details'
            // },
            {
                type: 'add',
                time: '@now'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'cancellation_requested',
                    details: 'Payment cancellation has been requested'
                }
            },
            {
                type: 'emit',
                event: 'cancelPaymentRequested',
                input: {
                    id: '$id',
                    storeId: '$storeId',
                    amount: '$amount',
                    product: '$product',
                    customer: '!sub'
                }
            }
        ]
    },
    events: {
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
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'success',
                    details: 'Payment has been successfully processed'
                }
            },
            {
                type: 'broadcast',
                channel: 'payments',
                input: {
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'success',
                    details: 'Payment has been successfully processed'
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
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'failed',
                    details: '$status'
                }
            },
            {
                type: 'broadcast',
                channel: 'payments',
                input: {
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'failed',
                    details: '$status'
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
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'cancelled',
                    details: '$status'
                }
            },
            {
                type: 'broadcast',
                channel: 'payments',
                input: {
                    pk: '!sub',
                    sk: 'payment_{$id}_status',
                    status: 'cancelled',
                    details: '$status'
                }
            }
        ]
    }
}
