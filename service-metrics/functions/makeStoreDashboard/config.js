module.exports = {
    permissions: [
        {
            Effect: 'Allow',
            Action: 'cloudwatch:PutDashboard',
            Resource: '*'
        }
    ],

    trigger: 'rispressoapi{@stage}_storeCreated'
}
