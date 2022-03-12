const doc = `## Make Payment
This is a description of this lambda function`

module.exports = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'events:PutEvents',
            Resource: 'arn:aws:events:{@region}:{@accountId}:event-bus/default'
        }
    ],
    env: {
        STAGE: '{@stage}'
    },
    trigger: 'rispressoapi{@stage}_paymentRequested',
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
