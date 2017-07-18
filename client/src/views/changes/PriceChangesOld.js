var m = require("mithril");
var moment = require("moment");

var PriceChange = require("../../models/PriceChange");

var Layout = require("../Layout");
var MaterialCard = require("../general/MaterialCard");

//var first = true;

var PriceChanges = {
    oninit: function () {
        PriceChange.loadPriceChanges();
    },
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
        return m(Layout, m(".row",
            PriceChange.list.map(function (change) {
                var priceDifference = PriceChange.getPriceDifference(change);
                var percent = (priceDifference.percent - 100).toFixed(0);
                var colorClass = percent > 0 ? "red lighten-1" : "green lighten-1";
                var chips = [
                    m(".chip " + colorClass, percent, "%")
                ];
                if(percent == 0) {
                    return null;
                }
                return m(MaterialCard, {
                        color: colorClass,
                        title: change.varenavn,
                        chips: chips,
                        links: m("a", { href: "/product/" + change.varenummer, oncreate: m.route.link }, "Se produkt"),
                        /*image: "https://bilder.vinmonopolet.no/cache/515x515-0/" + change.varenummer + "-1.jpg"*/
                    },
                    m("p", "" + Math.abs(percent) + "% " + (percent > 0 ? "dyrere" : "billigere") + ", " + moment(change.time).format('D. MMMM YYYY')));
            }))
        );
    }
};

module.exports = PriceChanges;