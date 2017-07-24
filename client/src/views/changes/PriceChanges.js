var m = require("mithril");
var moment = require("moment");

var PriceChange = require("../../models/PriceChange");

var Layout = require("../Layout");
var MaterialCard = require("../general/MaterialCard");

//var first = true;
var lastDate;
var loading = true;

function loadPriceChanges() {
    loading = true;
    PriceChange.loadPriceChanges().then(function () {
        loading = false;
    });
}
var PriceChanges = {
    oninit: loadPriceChanges,
    // oncreate: function () {
    //     console.log("Create");
    //     $('.sample').matchHeight({ byRow: false});
    // },
    onupdate: function() {
        console.log("update");
        //if(first) {
        $('.sample').matchHeight({byRow: false});
        //$('.sample2').matchHeight({byRow: false});
        //  first = false;
        //}
        //$.fn.matchHeight._update();
    },
    view: function () {
        if(loading) {
            return m(Layout,
                m(".container",
                    m("h2", "Prisendringer"),
                    m(".progress", m(".indeterminate"))
                ));
        }
        return m(Layout, m(".container",
            m("h2", "Prisendringer"),
            m("ul.collection.with-header",
                PriceChange.list.map(function (change) {
                        var vnodes = [];
                        var date = moment(change.time).format('D. MMMM YYYY');

                        // Add date header if new date
                        if(date !== lastDate) {
                            vnodes.push(m("li.collection-header", m("h5", date)));
                            lastDate = date;
                        }

                        var priceDifference = PriceChange.getPriceDifference(change);
                        var percent = (priceDifference.percent - 100).toFixed(0);
                        var colorClass = percent > 0 ? "red lighten-1" : "green lighten-1";

                        if (percent == 0) {
                            return null;
                        }
                        vnodes.push(m("li.collection-item.avatar",
                            m("i", {class: "material-icons circle " + (percent > 0 ? "red" : "green")}, "arrow_" + (percent > 0 ? "upward" : "downward")),
                            m("span.title", change.varenavn + " ", m("b", (percent > 0 ? "+" : "") + percent + "%")),
                            m("p", "Satt " + (percent > 0 ? "opp" : "ned") + " fra " + change.old_value + ",- til " + change.new_value + ",-",
                                m("br"), m("a", {
                                    href: "/product/" + change.varenummer,
                                    oncreate: m.route.link
                                }, "Gå til produkt")
                            )
                        ));
                        return vnodes;
                    }
                )
            )
        ));
    }
};

module.exports = PriceChanges;