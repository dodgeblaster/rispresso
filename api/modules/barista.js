module.exports = {
    api: {
        listBaristas: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: 'manager_{!sub}',
                sk: 'store_{$storeId}'
            },
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: 'store_{$storeId}',
                    sk: 'barista_'
                }
            }
        ],
        createBarista: [
            {
                type: 'input',
                storeId: 'string',
                name: 'string',
                email: 'string'
            },
            {
                type: 'guard',
                pk: 'manager_{!sub}',
                sk: 'store_{$storeId}'
            },
            {
                type: 'add',
                id: '@id'
            },
            {
                type: 'users',
                action: 'add',
                email: '$email'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'store_{$storeId}',
                    sk: 'barista_{$userId}',
                    id: '$id',
                    name: '$name',
                    email: '$email',
                    // for demo only, in real scenarios you would want
                    // to email the temp password rather than save it
                    // in a db
                    pass: '$password'
                }
            },
            {
                type: 'emit',
                event: 'baristaCreated',
                input: {
                    id: '$id',
                    storeId: '$storeId',
                    name: '$name',
                    email: '$email'
                }
            }
        ],
        removeBarista: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string',
                email: 'string'
            },
            {
                type: 'guard',
                pk: 'manager_{!sub}',
                sk: 'store_{$storeId}'
            },
            {
                type: 'users',
                action: 'remove',
                email: '$email'
            },
            {
                type: 'db',
                action: 'remove',
                input: {
                    pk: 'store_{$storeId}',
                    sk: 'barista_{$id}'
                }
            },
            {
                type: 'emit',
                event: 'baristaRemoved',
                input: {
                    id: '$id',
                    storeId: '$storeid',
                    email: '$email'
                }
            }
        ]
    }
}
