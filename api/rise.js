module.exports = {
    api: {},
    events: {
        admindev_createManagerRequested: [
            {
                type: 'input',
                email: 'string'
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
                    pk: 'manager',
                    sk: 'manager_{$userId}',
                    email: '$email',
                    pass: '$password'
                }
            }
        ],
        admindev_createCustomerRequested: [
            {
                type: 'input',
                email: 'string'
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
                    pk: 'customer_{$userId}',
                    sk: 'meta',
                    email: '$email',
                    pass: '$password'
                }
            }
        ]
    },
    config: {
        name: 'rispressoapi',
        auth: true,
        eventBus: 'default',
        dashboard: false
    }
}
