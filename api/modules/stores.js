module.exports = {
    api: {
        listStores: [
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: 'store',
                    sk: 'store_'
                }
            }
        ],
        listManagersStores: [
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: 'manager_{!sub}',
                    sk: 'store_'
                }
            }
        ],
        getStore: [
            {
                type: 'input',
                id: 'string'
            },
            {
                type: 'db',
                action: 'get',
                input: {
                    pk: '!sub',
                    sk: 'store_{$id}'
                }
            },
            {
                type: 'output',
                id: 'string',
                name: 'string',
                location: 'string',
                orderCapacity: 'number'
            }
        ],
        createStore: [
            {
                type: 'input',
                name: 'string',
                location: 'string',
                orderCapacity: 'number'
            },
            {
                type: 'guard',
                pk: 'manager',
                sk: 'manager_{!sub}'
            },
            {
                type: 'add',
                id: '@id'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'manager_{!sub}',
                    sk: 'store_{$id}',
                    id: '$id',
                    name: '$name',
                    location: '$location',
                    orderCapacity: '$orderCapacity'
                }
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'store',
                    sk: 'store_{$id}',
                    id: '$id',
                    name: '$name',
                    location: '$location',
                    orderCapacity: '$orderCapacity'
                }
            },
            {
                type: 'emit',
                event: 'storeCreated',
                input: {
                    id: '$id',
                    name: '$name',
                    location: '$location',
                    orderCapacity: '$orderCapacity'
                }
            }
        ],
        removeStore: [
            {
                type: 'input',
                id: 'string'
            },
            {
                type: 'guard',
                pk: 'manager_{!sub}',
                sk: 'store_{$id}'
            },
            {
                type: 'db',
                action: 'remove',
                input: {
                    pk: 'manager_{!sub}',
                    sk: 'store_{$id}'
                }
            },
            {
                type: 'db',
                action: 'remove',
                input: {
                    pk: 'store',
                    sk: 'store_{$id}'
                }
            },
            {
                type: 'emit',
                event: 'storeRemoved',
                input: {
                    id: '$id'
                }
            }
        ]
    }
}
