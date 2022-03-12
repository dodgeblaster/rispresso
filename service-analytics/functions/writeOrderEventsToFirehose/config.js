const doc = `## Record Order Status Update
This is a description of this lambda function`

module.exports = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'firehose:PutRecord',
            Resource:
                'arn:aws:firehose:{@region}:{@accountId}:deliverystream/{@output.RispressoAnalyticsDev.FirehoseName}'
        }
    ],
    env: {
        STREAM: '{@output.RispressoAnalyticsDev.FirehoseName}'
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
