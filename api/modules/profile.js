module.exports = {
    api: {
        getProfile: [
            {
                type: 'db',
                action: 'get',
                input: {
                    pk: 'customer_{!sub}',
                    sk: 'profile'
                }
            },
            {
                type: 'output',
                name: 'string'
            }
        ],

        getCreditCardInfo: [
            {
                type: 'db',
                action: 'get',
                input: {
                    pk: 'customer_{!sub}',
                    sk: 'creditCardInfo'
                }
            },
            {
                type: 'output',
                creditCardInfo: 'string'
            }
        ],

        setProfile: [
            {
                type: 'input',
                name: 'string'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'customer_{!sub}',
                    sk: 'profile',
                    name: '$name'
                }
            }
        ],
        setCreditCardInfo: [
            {
                type: 'input',
                creditCardInfo: 'string'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'customer_{!sub}',
                    sk: 'creditCardInfo',
                    creditCardInfo: '$creditCardInfo'
                }
            }
        ]
    }
}
