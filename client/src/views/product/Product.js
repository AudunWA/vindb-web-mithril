var m = require("mithril");
var moment = require("moment");

var Product = require("../../models/Product");
var Layout = require("../Layout");
var PriceHistoryCard = require("./PriceHistoryCard");

// Set moment locale
moment.locale("nb");

var productId;

const tabs = [
    { title: "Produkt", href: "#main_tab"},
    { isActive: true, title: "Prisgraf", href: "#price_tab"},
    { title: "Historikk", href: "#history_tab"}
];

var Tabs = {
    oncreate: function () {
        // Make sure tabs get initialized
        $('ul.tabs').tabs();
    },
    view: function (vnode) {
        return m(".nav-content",
            m("ul.tabs", vnode.attrs.tabs.map(function (tab) {
                    return m("li.tab", m("a",{ class: tab.isActive ? "active" : "", href: tab.href }, tab.title))
                })
            )
        )
    }
};

var ProductInfoCard = {
    view: function (vnode) {
        var product = vnode.attrs.product;
        if(product === null) return null;

        return m(".card indigo darken-1",
            m(".card-content white-text",
                m("span.card-title", product.varenavn),
                m("p", m("b", "Varenummer: "), product.varenummer),
                m("p", m("b", "Alkoholprosent: "), product.alkohol + "%"),
                m("p", m("b", "Volum: "), product.volum + " liter"),
                m("p", m("b", "Pris: "), product.pris.toFixed(2) + ",-"),
                m("p", m("b", "Literspris: "), (product.pris / product.volum).toFixed(2) + ",-"),
                m("p", m("b", "Etanol per krone (EPK): "), ((product.alkohol / 100 * product.volum) / product.pris * 1000000).toFixed(3) + " mikroliter"),
                m("p", m("b", "Først sett: "), moment(product.first_seen).format('D. MMMM YYYY')),
                m("p", m("b", "Sist sett: "), moment(product.last_seen).format('D. MMMM YYYY'))
            ),
            m(".card-action", m("a", { href: "http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-" + product.varenummer }, "Finn på Vinmonopolet"))
        );
    }
};

var ExtendedProductInfoCard = {
    product: null,
    getValueMap: function () {
        var values = [];
        if(product.passer_til_1 !== null) {
            var fitsWith = product.passer_til_1;
            if(product.passer_til_2 !== null) {
                fitsWith += ", " + product.passer_til_2;
            }
            if(product.passer_til_3 !== null) {
                fitsWith += ", " + product.passer_til_3;
            }
            values.push({ name: "Passer til: ", value: fitsWith });
        }

        if(product.argang !== null) {
            values.push({ name: "År: ", value: product.argang});
        }
        if(product.rastoff !== null) {
            values.push({ name: "Råstoff: ", value: product.rastoff});
        }
        if(product.metode !== null) {
            values.push({ name: "Metode: ", value: product.metode});
        }
        if(product.sukker !== null) {
            values.push({ name: "Sukker: ", value: product.sukker + " gram per liter"});
        }
        if(product.syre !== null) {
            values.push({ name: "Syre: ", value: product.syre + " gram per liter"});
        }
        if(product.lagringsgrad !== null) {
            values.push({ name: "Lagringsgrad: ", value: product.lagringsgrad });
        }
        return values;
    },
    view: function (vnode) {
        product = vnode.attrs.product;
        if(product === null) return null;

        return m(".card blue",
            m(".card-content white-text",
                m("span.card-title", "Tillegsinformasjon"),
                this.getValueMap().map(function (pair) {
                    return m("p", m("b", pair.name), pair.value);
                })
            )
        );
    }
};

var ProductHistoryCard = {
    view: function (vnode) {
        var history = vnode.attrs.history;
        if(history === null) return null;

        return m(".card blue",
            m(".card-content white-text",
                m("span.card-title", "Historikk"),
                m("table.bordered.responsive-table",
                    m("thead",
                        m("tr",
                            m("th[data-field='field']", "Felt"),
                            m("th[data-field='old']", "Gammel verdi"),
                            m("th[data-field='new']", "Ny verdi"),
                            m("th[data-field='time']", "Tidspunkt")
                        )
                    ),
                    m("tbody", history.map(function (row) {
                            return m("tr",
                                m("td", row.name),
                                m("td", row.old_value || m("i", "Ingen verdi")),
                                m("td", row.new_value || m("i", "Ingen verdi")),
                                m("td", moment(row.time).format('D. MMMM YYYY'))
                            )
                        })
                    )
                )
            )
        );
    }
};

var ProductView = {
    oninit: function (vnode) {
        productId = vnode.attrs.id;
        Product.loadCurrent(productId);
    },
    view: function () {
        return m(Layout, /*{ tabs: tabs},*/
            m(Tabs, { tabs: tabs }),
            m(".container",
                m("#main_tab.col m12 s12",
                    m(".row",
                        m(".col m6 s12",
                            m(ProductInfoCard, { product: Product.currentProduct })
                        ),
                        m(".col m6 s12",
                            m(ExtendedProductInfoCard, { product: Product.currentProduct }))
                    )
                ),
                m("#price_tab.col m12 s12",
                    m(".row", m(PriceHistoryCard, { product: Product.currentProduct }))
                ),
                m("#history_tab.col m12 s12",
                    m(ProductHistoryCard, { history: Product.currentChanges })
                )
            )
        );
    }
};

module.exports = ProductView;