/**
 * Access Patterns
 *
 * Orders need to be accessed by:
 * - Customers
 * - Baristas
 *
 * Customers need to access their single order by id
 * Baristas need to be able to list all orders for a store in a day
 *
 * To support these different access patterns, we set the following keys:
 * Barista:
 * - pk: '{$storeId}_{@today}',
 * - sk: 'order_{$orderId}_details'
 *
 * Customer:
 * - pk2: '{$customerId}',
 * - sk: 'order_{$orderId}_details
 *
 */

const ORDER_UPDATE_INPUT = {
    type: 'input',
    storeId: 'string',
    orderId: 'string',
    customerId: 'string'
}

const IS_BARISTA = {
    type: 'guard',
    pk: 'store_{$storeId}',
    sk: 'barista_{!sub}'
}

const recordOrderEvent = (event) => ({
    type: 'db',
    action: 'set',
    input: {
        pk: 'store_{$storeId}_{@today}',
        sk: 'order_{$orderId}_event_{@now}',
        pk2: 'customer_{$customerId}',
        orderId: '$orderId',
        time: '@now',
        event: event
    }
})

const emitOrderUpdate = (state) => ({
    type: 'emit',
    event: 'orderStatusUpdated',
    input: {
        storeId: '$storeId',
        orderId: '$orderId',
        customerId: '$customerId',
        author: '!sub',
        time: '@now',
        event: state
    }
})

const emitOrderUpdateFromEvent = (state) => ({
    type: 'emit',
    event: 'orderStatusUpdated',
    input: {
        storeId: '$storeId',
        orderId: '$orderId',
        customerId: '$customerId',
        author: '$customerId',
        time: '@now',
        event: state
    }
})

const broadcastOrderUpdateToCustomer = (event) => ({
    type: 'broadcast',
    channel: 'customer_{$customerId}',
    input: {
        orderId: '$orderId',
        time: '@now',
        event: event
    }
})

module.exports = {
    api: {
        listBaristaOrders: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: 'store_{$storeId}',
                sk: 'barista_{!sub}'
            },
            {
                type: 'add',
                pk: 'store_{$storeId}_{@today}',
                sk: 'order_'
            },
            {
                type: 'db',
                action: 'list'
            }
        ],

        getCustomersCurrentOrder: [
            {
                type: 'db',
                action: 'get',
                input: {
                    pk: 'customer_{!sub}',
                    sk: 'currentOrder'
                }
            }
        ],
        getCustomersCurrentOrderDetails: [
            {
                type: 'input',
                orderId: 'string'
            },
            {
                type: 'db',
                action: 'list',
                input: {
                    pk2: 'customer_{!sub}',
                    sk: 'order_{$orderId}_'
                }
            }
        ],

        startOrderPayment: [
            {
                type: 'input',
                storeId: 'string',
                products: 'string',
                amount: 'number',
                customerName: 'string'
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
                    pk: 'store_{$storeId}_{@today}',
                    sk: 'order_{$id}_details',
                    pk2: 'customer_{!sub}',
                    storeId: '$storeId',
                    orderId: '$id',
                    amount: '$amount',
                    products: '$products',
                    time: '$time',
                    customerId: '!sub',
                    customerName: '$customerName'
                }
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'customer_{!sub}',
                    sk: 'currentOrder',
                    orderId: '$id'
                }
            },
            {
                type: 'emit',
                event: 'paymentRequested',
                input: {
                    orderId: '$id',
                    customerId: '!sub',
                    storeId: '$storeId',
                    amount: '$amount',
                    products: '$products',
                    customerName: '$customerName'
                }
            }
        ],

        orderStarted: [
            ORDER_UPDATE_INPUT,
            IS_BARISTA,
            recordOrderEvent('ORDER_STARTED'),
            emitOrderUpdate('ORDER_STARTED'),
            broadcastOrderUpdateToCustomer('ORDER_STARTED')
        ],
        orderReady: [
            ORDER_UPDATE_INPUT,
            IS_BARISTA,
            recordOrderEvent('ORDER_READY'),
            emitOrderUpdate('ORDER_READY'),
            broadcastOrderUpdateToCustomer('ORDER_READY')
        ],
        orderComplete: [
            ORDER_UPDATE_INPUT,
            IS_BARISTA,
            recordOrderEvent('ORDER_COMPLETE'),
            emitOrderUpdate('ORDER_COMPLETE'),
            broadcastOrderUpdateToCustomer('ORDER_COMPLETE'),
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'customer_{$customerId}',
                    sk: 'currentOrder',
                    orderId: 'NONE'
                }
            }
        ],
        dismissCurrentOrder: [
            {
                type: 'db',
                action: 'set',
                input: {
                    pk2: 'customer_{$customerId}',
                    sk: 'currentOrder',
                    orderId: 'NONE'
                }
            }
        ],
        cancelOrder: [
            {
                type: 'input',
                storeId: 'string',
                orderId: 'string'
            },
            {
                type: 'add',
                customerId: '!sub'
            },
            recordOrderEvent('ORDER_CANCELLATION_STARTED'),
            {
                type: 'emit',
                event: 'orderCancellationRequested',
                input: {
                    storeId: '$storeId',
                    orderId: '$orderId',
                    customerId: '$customerId',
                    time: '@now'
                }
            }
        ]
    },
    events: {
        rispressopaymentsdev_paymentCompleted: [
            {
                type: 'input',
                storeId: 'string',
                orderId: 'string',
                customerId: 'string',
                customerName: 'string',
                status: 'string',
                statusDetails: 'string',
                products: 'string',
                amount: 'number'
            },
            recordOrderEvent('ORDER_PLACED'),
            emitOrderUpdateFromEvent('ORDER_PLACED'),
            broadcastOrderUpdateToCustomer('ORDER_PLACED'),
            {
                type: 'broadcast',
                channel: 'barista_{$storeId}',
                input: {
                    orderId: '$orderId',
                    time: '@now',
                    products: '$products',
                    customerId: '$customerId',
                    customerName: '$customerName',
                    storeId: '$storeId'
                }
            }
        ],
        rispressopaymentsdev_cancellationCompleted: [
            ORDER_UPDATE_INPUT,
            recordOrderEvent('ORDER_CANCELLATION_COMPLETE'),
            emitOrderUpdateFromEvent('ORDER_CANCELLATION_COMPLETE'),
            broadcastOrderUpdateToCustomer('ORDER_CANCELLATION_COMPLETE'),
            {
                type: 'broadcast',
                channel: 'barista_{$storeId}',
                input: {
                    orderId: '$orderId',
                    time: '@now',
                    event: 'ORDER_CANCELLATION_COMPLETE'
                }
            }
        ]
    },
    connect: {
        customer: [
            {
                type: 'channel',
                key: 'customer_{!sub}'
            }
        ],
        barista: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: 'store_{$storeId}',
                sk: 'barista_{!sub}'
            },
            {
                type: 'channel',
                key: 'barista_{$storeId}'
            }
        ]
    }
}
