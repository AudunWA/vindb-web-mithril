const m = require("mithril");
const moment = require("moment");

const PriceChange = require("../../models/PriceChange");
const Layout = require("../Layout");
let loading = true;

function loadPriceChanges() {
    loading = true;
    PriceChange.loadPriceChanges().then(function () {
        loading = false;
    });
}

const PriceChanges = {
    oninit: loadPriceChanges,
    oncreate: function () {
        document.title = "Prisendringer - VinDB";
    },
    view: function () {
        if (loading) {
            return m(Layout,
                m(".container",
                    m("h2", "Prisendringer"),
                    m(".progress", m(".indeterminate"))
                ));
        }
        let lastDate = new Date(1970, 1, 1);

        return m(Layout, m(".container",
            m("h2", "Prisendringer"),
            m("ul.collection.with-header",
                PriceChange.list.map(function (change) {
                    const vnodes = [];
                    const date = moment(change.time).format('D. MMMM YYYY');

                    // Add date header if new date
                    if (date !== lastDate) {
                        vnodes.push(m("li.collection-header", m("h5", date)));
                        lastDate = date;
                    }

                    const priceDifference = PriceChange.getPriceDifference(change);
                    const percent = Math.trunc(priceDifference.percent - 100);

                    if (percent === 0) {
                        return vnodes;
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
                })
            )
        ));
    }
};

module.exports = PriceChanges;