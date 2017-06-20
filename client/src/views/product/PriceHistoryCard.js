var m = require("mithril");
var moment = require("moment");
var Chart = require('chart.js');

var Product = require("../../models/Product");

var PriceHistoryCard = {
    chart: null,
    oncreate: function (vnode) {
    },
    view: function (vnode) {
        if(!inited) {
            var product = vnode.attrs.product;
            if (product === null) return;

            Product.loadPriceHistory(product.varenummer).then(initChart);
        }
        inited = true;
        return m(".card",
            m(".card-content",
                m("span.card-title", "Prisutvikling"),
                m("canvas#price_chart[width='100%'][height='100%']")
            )
        )
    }
};

var inited = false;

function initChart(data) {
    // TODO: Move to models?
    var proceededData = doData(data);
    config = {
        type: 'line',
        data: {
            datasets: [
                {
                    label: "Pris",
                    fill: true,
                    steppedLine: true,
                    spanGaps: true,
                    backgroundColor: "#90caf9",
                    borderColor: "#5d99c6",
                    pointBackgroundColor: "#c3fdff",
                    data: proceededData.data
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Prisutvikling'
            },
            layout: {
                padding: {
                    left: 0,
                    right: 50,
                    top: 0,
                    bottom: 50
                }
            },
            scales: {
                xAxes: [
                    {
                        type: "time",
                        scaleLabel: {
                            display: true,
                            labelString: 'Dato'
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            stepSize: proceededData.units
                        },
                        time: {
                            max: proceededData.maxX,
                            round: "day",
                            unit: "day",
                            unitStepSize: proceededData.units
                        }
                    }
                ],
                yAxes: [
                    {
                        scaleLabel: {
                            display: true,
                            labelString: 'Pris'
                        },
                        ticks: {
                            beginAtZero: false,
                            max: proceededData.maxY
                        }
                    }
                ]
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            }
        }
    };
    var ch = new Chart("price_chart", config);
}

function doData(data) {
    if (data.length === 0) {
        return {data: [], maxY: 0};
    }

    var result = [];
    var maxY = parseFloat(data[0].old_value.replace(",", "."));
    var startDate = new Date(data[0].time);
    var maxDate = new Date(data[0].time);

    data.forEach(function(val) {
        var date = new Date(val.time);
        var yVal = parseFloat(val.new_value.replace(",", "."));
        if (yVal > maxY) {
            maxY = yVal;
        }

        if (date > maxDate) {
            maxDate = date;
        }

        result.push({x: date, y: yVal});
    });

    // Add today to data
    var today = new Date();
    result.push({
        x: today,
        y: result[result.length - 1].y
    });

    // Add "past" to data
    var deltaT = today - maxDate;
    var pastDate = new Date(startDate.getTime() - deltaT);
    result.unshift({
        x: pastDate,
        y: parseFloat(data[0].old_value.replace(",", "."))
    });

    // Calculate amount of labels to show
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var dayAmount = Math.round(Math.abs((pastDate.getTime() - today.getTime()) / (oneDay)));
    var units = Math.round(dayAmount / 17);

    // Hack to fix overlapping labels on end of x-axis
    var momentMaxDate = moment(maxDate);
    var maxX = today;

    return {
        data: result,
        maxX: maxX,
        maxY: Math.round(maxY + maxY * 0.1),
        units: units
    };
}

module.exports = PriceHistoryCard;