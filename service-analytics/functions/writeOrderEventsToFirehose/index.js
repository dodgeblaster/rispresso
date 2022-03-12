const AWS = require('aws-sdk')

const firehose = new AWS.Firehose({
    region: process.env.AWS_REGION
})

module.exports.handler = async (e) => {
    /**
     * We include this delimiter after each record
     * to seperate data in the same firehose record. If this delimiter
     * is not present, only the first record per  file (per minute) will
     * be able to be accessed by athena queries
     */
    const DELIMITER = '\n'
    const params = {
        DeliveryStreamName: process.env.STREAM,
        Record: {
            Data: JSON.stringify(e.detail) + DELIMITER
        }
    }
    await firehose.putRecord(params).promise()
}
