import m from "mithril";
import moment from "moment";
import Chart from "chart.js";
import Product from "../../models/Product";

const PriceHistoryCard = {
    inited: false,
    chart: null,
    oncreate: function (vnode) {
    },
    view: function (vnode) {
        if (!this.inited) {
            const product = vnode.attrs.product;
            if (product === null) return;

            Product.loadPriceHistory(product.varenummer).then(initChart);
        }
        this.inited = true;
        return m("div.s12#chart-container",
            m("h2", "Prisutvikling"),
            m("canvas#price_chart")
        );
    }
};

function initChart(data) {
    // TODO: Move to models?
    const proceededData = doData(data);
    const config = {
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
            maintainAspectRatio: true,
            title: {
                display: false,
                text: 'Prisutvikling'
            },
            layout: {
                padding: {
                    left: 0,
                    right: 50,
                    top: 0,
                    bottom: 0
                }
            },
            // scales: {
            //     xAxes: [
            //         {
            //             type: "time",
            //             scaleLabel: {
            //                 display: true,
            //                 labelString: 'Dato'
            //             },
            //             ticks: {
            //                 maxTicksLimit: 10,
            //                 stepSize: proceededData.units
            //             },
            //             time: {
            //                 max: proceededData.maxX,
            //                 round: "day",
            //                 unit: "day",
            //                 unitStepSize: proceededData.units
            //             }
            //         }
            //     ],
            //     yAxes: [
            //         {
            //             scaleLabel: {
            //                 display: true,
            //                 labelString: 'Pris'
            //             },
            //             ticks: {
            //                 beginAtZero: false,
            //                 max: proceededData.maxY
            //             }
            //         }
            //     ]
            // },
            scales: {
                xAxes: [{
                    type: "time",
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Dato'
                    },
                    time: {
                        max: proceededData.maxX.toString(),
                        tooltipFormat: "Do MMMM Y"
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Pris'
                    }
                }]
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves
                }
            }
        }
    };
    const ch = new Chart("price_chart", config);
}

function doData(data) {
    if (data.length === 0) {
        return {data: [], maxY: 0};
    }

    const result = [];
    let maxY = parseFloat(data[0].old_value.replace(",", "."));
    const startDate = new Date(data[0].time);
    let maxDate = new Date(data[0].time);

    data.forEach(function(val) {
        const date = new Date(val.time);
        const yVal = parseFloat(val.new_value.replace(",", "."));
        if (yVal > maxY) {
            maxY = yVal;
        }

        if (date > maxDate) {
            maxDate = date;
        }

        result.push({x: date, y: yVal});
    });

    // Add today to data
    const today = new Date();
    result.push({
        x: today,
        y: result[result.length - 1].y
    });

    // Add "past" to data
    const deltaT = today.getTime() - maxDate.getTime();
    const pastDate = new Date(startDate.getTime() - deltaT);
    result.unshift({
        x: pastDate,
        y: parseFloat(data[0].old_value.replace(",", "."))
    });

    // Calculate amount of labels to show
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const dayAmount = Math.round(Math.abs((pastDate.getTime() - today.getTime()) / (oneDay)));
    const units = Math.round(dayAmount / 17);

    // Hack to fix overlapping labels on end of x-axis
    const momentMaxDate = moment(maxDate);
    return {
        data: result,
        maxX: today,
        maxY: Math.round(maxY + maxY * 0.1),
        units: units
    };
}

export default PriceHistoryCard;