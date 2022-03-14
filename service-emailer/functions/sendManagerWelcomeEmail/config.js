module.exports = {
    permissions: [],
    env: {
        SENDGRID_KEY: '{@ssm.SENDGRID_KEY}',
        FROM: '{@ssm.FROM_EMAIL}'
    },
    trigger: 'rispressoapi{@stage}_managerCreated'
}
