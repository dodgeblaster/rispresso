module.exports = {
    permissions: [
        {
            Effect: 'Allow',
            Action: [
                'athena:StartQueryExecution',
                'athena:GetQueryExecution',
                'athena:GetQueryResults'
            ],
            Resource:
                'arn:aws:athena:{@region}:{@accountId}:workgroup/rispresso'
        },
        {
            Effect: 'Allow',
            Action: ['glue:GetTable'],
            Resource: [
                'arn:aws:glue:{@region}:{@accountId}:catalog',
                'arn:aws:glue:{@region}:{@accountId}:database/rispresso',
                'arn:aws:glue:{@region}:{@accountId}:table/rispresso/order_events'
            ]
        },
        {
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Resource: 'arn:aws:events:{@region}:{@accountId}:event-bus/default'
        },
        {
            Effect: 'Allow',
            Action: ['s3:*'],
            Resource: ['*']
        }
    ],

    trigger: 'rispressoapi{@stage}_analyticsQueryRequested'
}
