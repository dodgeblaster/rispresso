const doc = `## Record Order Status Update
This is a description of this lambda function`

module.exports = {
    permissions: [
        {
            Effect: 'Allow',
            Action: ['dynamodb:PutItem', 'dynamodb:Query'],
            Resource:
                'arn:aws:dynamodb:{@region}:{@accountId}:table/rispressometrics{@stage}'
        },
        {
            Effect: 'Allow',
            Action: 'cloudwatch:PutMetricData',
            Resource: '*'
        }
    ],
    env: {
        TABLE: 'rispressometrics{@stage}'
    },
    trigger: 'rispressoapi{@stage}_orderStatusUpdated',
    dashboard: {
        doc,
        invocationAlarm: 0,
        invocationGoal: 10,
        errorGoal: 0,
        errorAlarm: 2,
        durationAlarm: 20000,
        durationGoal: 1000
    },
    alarm: {
        threshold: 2,
        snsTopic: 'arn:aws:sns:{@region}:{@accountId}:ChatOpsTopic'
    }
}
