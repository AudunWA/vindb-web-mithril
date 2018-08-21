const m = require("mithril");
const moment = require("moment");

const PriceChange = require("../../models/PriceChange");
const Layout = require("../Layout");
const MaterialCard = require("../general/MaterialCard");

const PriceChanges = {
    oninit: function () {
        PriceChange.loadPriceChanges();
    },
    oncreate: function () {
        document.title = "Prisendringer - VinDB";
    },
    view: function () {
        return m(Layout, m(".row",
            PriceChange.list.map(function (change) {
                const priceDifference = PriceChange.getPriceDifference(change);
                const percent = Math.trunc(priceDifference.percent - 100);

                if (percent === 0) {
                    return null;
                }

                const colorClass = percent > 0 ? "red lighten-1" : "green lighten-1";
                const chips = [
                    m(".chip " + colorClass, percent, "%")
                ];
                return m(MaterialCard, {
                        color: colorClass,
                        title: change.varenavn,
                        chips: chips,
                        links: m("a", {href: "/product/" + change.varenummer, oncreate: m.route.link}, "Se produkt"),
                        // image: "https://bilder.vinmonopolet.no/cache/515x515-0/" + change.varenummer + "-1.jpg"
                    },
                    m("p", "" + Math.abs(percent) + "% " + (percent > 0 ? "dyrere" : "billigere") + ", " + moment(change.time).format('D. MMMM YYYY')));
            }))
        );
    }
};

module.exports = PriceChanges;