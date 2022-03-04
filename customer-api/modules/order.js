module.exports = {
    api: {
        placeOrder: [
            {
                type: 'input',
                storeId: 'string',
                items: 'string',
                amount: 'number'
            },
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
                    customer: '!sub',
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
                product: 'string',
                customer: 'string'
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
                channel: 'customer_{$customer}',
                input: {
                    orderId: '1234',
                    name: 'Gary'
                }
            }
        ]
    }
}
