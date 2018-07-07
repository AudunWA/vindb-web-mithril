var m = require("mithril");
var moment = require("moment");

var Product = require("../../models/Product");
var Layout = require("../Layout");
var PriceHistoryCard = require("./PriceHistoryCard");
var ProductHistoryCard = require("./ProductHistoryCard");

// Set moment locale
moment.locale("nb");

var productId;
var tabsInstance;
var tab;

const tabs = [
    { isActive: true, title: "Produkt", href: "#main_tab"},
    { title: "Prisgraf", href: "#price_tab"},
    { title: "Historikk", href: "#history_tab"}
];

var Tabs = {
    oncreate: function () {
        // Make sure tabs get initialized
        tabsInstance = M.Tabs.init(document.querySelectorAll(".tabs"), { onShow: updateTabInUrl });
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

function updateTabInUrl(tab) {
    var data = m.route.param();

    var tabId;
    switch (tab.id) {
        // case "main_tab":
        // default:
        //     tabId = "main";
        //     break;
        case "price_tab":
            tabId = "price";
            break;
        case "history_tab":
            tabId = "history";
            break;
    }

    if(data["tab"] !== tabId) {
        if(tabId == null) {
            delete data.tab;
            m.route.set("/product/:id", data);
        } else {
            data["tab"] = tabId;
            m.route.set("/product/:id/:tab", data);
        }
    }
}

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
            m(".card-action", m("a", { href: "https://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-" + product.varenummer }, "Finn på Vinmonopolet"))
        );
    }
};


var ExtendedProductInfoCard = {
    product: null,
    getValueMap: function () {
        var values = [];
        if(this.product.passer_til_1 !== null) {
            var fitsWith = this.product.passer_til_1;
            if(this.product.passer_til_2 !== null) {
                fitsWith += ", " + this.product.passer_til_2;
            }
            if(this.product.passer_til_3 !== null) {
                fitsWith += ", " + this.product.passer_til_3;
            }
            values.push({ name: "Passer til: ", value: fitsWith });
        }

        if(this.product.argang !== null) {
            values.push({ name: "År: ", value: this.product.argang});
        }
        if(this.product.rastoff !== null) {
            values.push({ name: "Råstoff: ", value: this.product.rastoff});
        }
        if(this.product.metode !== null) {
            values.push({ name: "Metode: ", value: this.product.metode});
        }
        if(this.product.sukker !== null) {
            values.push({ name: "Sukker: ", value: this.product.sukker + " gram per liter"});
        }
        if(this.product.syre !== null) {
            values.push({ name: "Syre: ", value: this.product.syre + " gram per liter"});
        }
        if(this.product.lagringsgrad !== null) {
            values.push({ name: "Lagringsgrad: ", value: this.product.lagringsgrad });
        }
        return values;
    },
    view: function (vnode) {
        this.product = vnode.attrs.product;
        if(this.product === null) return null;

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

function selectCorrectTab() {
    var tabId;
    switch (tab) {
        case "main":
        default:
            tabId = "main_tab";
            break;
        case "price":
            tabId = "price_tab";
            break;
        case "history":
            tabId = "history_tab";
            break;
    }
    const instance = M.Tabs.getInstance(document.querySelector(".tabs"));
    instance.select(tabId);
}

var ProductView = {
    oninit: function (vnode) {
        productId = vnode.attrs.id;
        tab = vnode.attrs.tab;
        console.log(tab);
        Product.loadCurrent(productId).then(() => this.product = Product.currentProduct);
    },
    view: function (vnode) {
        console.log("view");

        return m(Layout, /*{ tabs: tabs},*/
            m(Tabs, { tabs: tabs }),
            m(".container",
                m("#main_tab.col m12 s12",
                    this.product ? m(".row",
                        m(".col m6 s12",
                            m(ProductInfoCard, { product: Product.currentProduct })
                        ),
                        m(".col m6 s12",
                            m(ExtendedProductInfoCard, { product: Product.currentProduct }))
                    ) : null
                ),
                m("#price_tab.col m12 s12",
                    this.product ? m(".row", m(PriceHistoryCard, { product: Product.currentProduct })) : null
                ),
                m("#history_tab.col m12 s12",
                    this.product ? m(ProductHistoryCard, { history: Product.currentChanges }) : null
                )
            )
        );
    },
    oncreate: function(vnode) {
        console.log("DOM created")
    },
    onupdate: function(vnode) {
        tab = vnode.attrs.tab;
        selectCorrectTab();
        console.log("onupdate")
    },
    onbeforeremove: function(vnode) {
        console.log("exit animation can start")
        return new Promise(function(resolve) {
            // call after animation completes
            resolve()
        })
    },
    onremove: function(vnode) {
        console.log("removing DOM element")
    },
    onbeforeupdate: function(vnode, old) {
        return true
    },
};

module.exports = ProductView;