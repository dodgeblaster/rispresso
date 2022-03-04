module.exports = {
    api: {
        echo: [
            {
                type: 'input',
                test: 'string'
            },
            {
                type: 'output',
                test: 'string'
            }
        ],
        send: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'broadcast',
                channel: 'barista_1234',
                input: {
                    orderId: '1234',
                    name: 'Gary'
                }
            },
            {
                type: 'output',
                storeId: 'string'
            }
        ]
    },
    events: {},
    connect: {
        barista: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: '$storeId',
                sk: 'staff_{!sub}'
            },
            {
                type: 'channel',
                key: 'barista_{$storeId}'
            }
        ]
    },
    config: {
        name: 'coffee2customer',
        auth: true,
        eventBus: 'default',
        dashboard: false
    }
}
