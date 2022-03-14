module.exports = {
    api: {
        listProducts: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: 'store_{$storeId}',
                    sk: 'product_'
                }
            }
        ],
        createProduct: [
            {
                type: 'input',
                storeId: 'string',
                name: 'string',
                amount: 'number',
                img: 'string'
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
                type: 'db',
                action: 'set',
                input: {
                    pk: 'store_{$storeId}',
                    sk: 'product_{$id}',
                    id: '$id',
                    name: '$name',
                    amount: '$amount',
                    img: '$img'
                }
            },
            {
                type: 'emit',
                event: 'productCreated',
                input: {
                    id: '$id',
                    storeId: '$storeId',
                    name: '$name',
                    amount: '$amount',
                    img: '$img'
                }
            }
        ],
        removeProduct: [
            {
                type: 'input',
                id: 'string',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: 'manager_{!sub}',
                sk: 'store_{$storeId}'
            },
            {
                type: 'db',
                action: 'remove',
                input: {
                    pk: 'store_{$storeId}',
                    sk: 'product_{$id}'
                }
            },
            {
                type: 'emit',
                event: 'productRemoved',
                input: {
                    id: '$id',
                    storeId: '$storeid'
                }
            }
        ]
    }
}
