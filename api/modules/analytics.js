const IS_MANAGER = {
    type: 'guard',
    pk: 'manager_{!sub}',
    sk: 'store_{$storeId}'
}

const ADD_ID = {
    type: 'add',
    id: '@id'
}

const ADD_SQL = (sql) => ({
    type: 'add',
    query: sql
})

const EMIT_QUERY_REQUEST = {
    type: 'emit',
    event: 'analyticsQueryRequested',
    input: {
        queryId: '$id',
        storeId: '$storeId',
        query: '$query'
    }
}

const OUTPUT = {
    type: 'output',
    queryId: '$id'
}

module.exports = {
    api: {
        analyticsQueryBaristaCompletedOrders: [
            {
                type: 'input',
                storeId: 'string',
                baristaId: 'string'
            },
            IS_MANAGER,
            ADD_ID,
            ADD_SQL(
                `SELECT * FROM rispresso.order_events
                WHERE storeId='{$storeId}' AND
                WHERE event='ORDER_COMPLETE' AND
                WHERE author='{$baristaId}'
                `
            ),
            EMIT_QUERY_REQUEST,
            OUTPUT
        ]
    },
    events: {
        rispressoanalyticsdev_queryCompleted: [
            {
                type: 'input',
                storeId: 'string',
                queryId: 'string',
                data: 'string'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'query',
                    sk: 'query',
                    query: '$data',
                    storeId: '$storeId',
                    queryId: '$queryId'
                }
            }
        ]
    },
    connect: {
        managerAnalytics: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: '!sub',
                sk: 'store_{$storeId}'
            },
            {
                type: 'channel',
                key: 'analytics_{$storeId}'
            }
        ]
    }
}
