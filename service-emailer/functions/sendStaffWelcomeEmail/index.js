const sendgrid = require('@sendgrid/mail')
sendgrid.setApiKey(process.env.SENDGRID_KEY)

const htmlBody = ({ email, tempPass }) => `<div>
<p>Here are your signin credentials</p>
<p>Email: ${email}</p>
<p>Temporary Password: ${tempPass}</p>
</div>`

const sendEmail = async ({ email, tempPass }) => {
    const isDemo = true
    const to = isDemo ? process.env.FROM : email
    try {
        await sendgrid.send({
            to,
            from: process.env.FROM,
            subject: 'Welcome to the Rispresso Team!',
            text: 'Rispresso is the fastest way to order coffee',
            html: htmlBody({
                email: email,
                tempPass
            })
        })
        console.log('Email sent')
    } catch (e) {
        console.error(e)
    }
}

module.exports.handler = async (e) => {
    const email = e.detail.email
    const tempPass = e.detail.tempPass
    await sendEmail({
        email,
        tempPass
    })
}
