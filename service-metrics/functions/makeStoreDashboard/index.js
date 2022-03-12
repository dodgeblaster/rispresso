const AWS = require('aws-sdk')
const cloudwatch = new AWS.CloudWatch({
    region: process.env.AWS_REGION
})

async function makeDashboard({ storeName, storeId }) {
    const params = {
        DashboardName: `RispressoStore-${storeName}`,
        DashboardBody: JSON.stringify({
            widgets: [
                {
                    type: 'metric',
                    x: 12,
                    y: 0,
                    width: 12,
                    height: 5,
                    properties: {
                        metrics: [
                            [
                                'rispresso-customer-wait-time',
                                'Time',
                                'Store',
                                storeId
                            ]
                        ],
                        view: 'timeSeries',
                        stacked: false,
                        region: 'us-east-1',
                        stat: 'Average',
                        period: 300,
                        title: 'Average over time',
                        annotations: {
                            horizontal: [
                                {
                                    label: '2 Minutes',
                                    value: 120000
                                },
                                {
                                    color: '#2ca02c',
                                    label: '30 Seconds',
                                    value: 30000
                                }
                            ]
                        }
                    }
                },
                {
                    type: 'metric',
                    x: 12,
                    y: 5,
                    width: 12,
                    height: 5,
                    properties: {
                        metrics: [
                            [
                                'rispresso-customer-wait-time',
                                'Time',
                                'Store',
                                storeId,
                                { region: 'us-east-1' }
                            ]
                        ],
                        view: 'timeSeries',
                        stacked: false,
                        region: 'us-east-1',
                        stat: 'p99',
                        period: 300,
                        title: 'Most Wait Time over time',
                        annotations: {
                            horizontal: [
                                {
                                    label: '2 Minutes',
                                    value: 120000
                                }
                            ]
                        }
                    }
                },
                {
                    type: 'metric',
                    x: 6,
                    y: 0,
                    width: 6,
                    height: 5,
                    properties: {
                        metrics: [
                            [
                                'rispresso-customer-wait-time',
                                'Time',
                                'Store',
                                storeId
                            ]
                        ],
                        view: 'singleValue',
                        stacked: false,
                        region: 'us-east-1',
                        stat: 'Average',
                        period: 300,
                        title: 'Average Wait Time',
                        setPeriodToTimeRange: true,
                        sparkline: false
                    }
                },
                {
                    type: 'metric',
                    x: 6,
                    y: 5,
                    width: 6,
                    height: 5,
                    properties: {
                        metrics: [
                            [
                                'rispresso-customer-wait-time',
                                'Time',
                                'Store',
                                storeId
                            ]
                        ],
                        view: 'singleValue',
                        stacked: false,
                        region: 'us-east-1',
                        stat: 'p99',
                        period: 300,
                        title: 'Worst Wait Time',
                        setPeriodToTimeRange: true,
                        sparkline: false
                    }
                },
                {
                    type: 'metric',
                    x: 12,
                    y: 10,
                    width: 12,
                    height: 5,
                    properties: {
                        metrics: [
                            ['rispresso-payments', 'Amount', 'Store', storeId]
                        ],
                        view: 'timeSeries',
                        stacked: false,
                        region: 'us-east-1',
                        stat: 'Sum',
                        period: 300,
                        title: 'Profits over time'
                    }
                },
                {
                    type: 'metric',
                    x: 6,
                    y: 10,
                    width: 6,
                    height: 5,
                    properties: {
                        metrics: [
                            ['rispresso-payments', 'Amount', 'Store', storeId]
                        ],
                        view: 'singleValue',
                        stacked: false,
                        region: 'us-east-1',
                        stat: 'Sum',
                        period: 300,
                        title: 'Total Profits',
                        setPeriodToTimeRange: true,
                        sparkline: false
                    }
                },
                {
                    type: 'text',
                    x: 0,
                    y: 0,
                    width: 6,
                    height: 5,
                    properties: {
                        markdown:
                            '## Average Wait Time\nThis is the wait time in milliseconds a customer waits between their order being placed and the time their order is ready\n'
                    }
                },
                {
                    type: 'text',
                    x: 0,
                    y: 5,
                    width: 6,
                    height: 5,
                    properties: {
                        markdown:
                            '## Worst Wait Time\nThis is the worst wait time in milliseconds a customer waits between their order being placed and the time their order is ready. The worst wait time is measured in P99\n'
                    }
                },
                {
                    type: 'text',
                    x: 0,
                    y: 10,
                    width: 6,
                    height: 5,
                    properties: {
                        markdown:
                            '## Profits\nThis is profits recorded from each payment submitted to the payment service. The unit is 100 per $1.00\n'
                    }
                }
            ]
        })
    }

    await cloudwatch.putDashboard(params).promise()
}

module.exports.handler = async (e) => {
    const storeId = e.detail.id
    const storeName = e.detail.name
    await makeDashboard({
        storeId,
        storeName
    })
}
