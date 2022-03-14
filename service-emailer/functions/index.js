const AWS = require('aws-sdk')

const ses = new AWS.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1'
})

const email = async (body, subject, fromAddress, to) => {
    var params = {
        Destination: {
            CcAddresses: [],
            ToAddresses: to
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<p>${body}</p>`
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        },
        Source: fromAddress,
        ReplyToAddresses: [fromAddress]
    }

    await ses.sendEmail(params).promise()
}
