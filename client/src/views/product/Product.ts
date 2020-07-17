import m from "mithril";
import moment from "moment";
import Product from "../../models/Product";
import Layout from "../Layout";
import PriceHistoryCard from "./PriceHistoryCard";
import ProductHistoryCard from "./ProductHistoryCard";
import { setMetaDescription } from "../../util/meta";
// Set moment locale
moment.locale("nb");

let productId;
let tabsInstance;
let tab;

const tabs = [
    { isActive: true, title: "Produkt", href: "#main_tab" },
    { title: "Prisgraf", href: "#price_tab" },
    { title: "Historikk", href: "#history_tab" },
];

const Tabs = {
    oncreate: function () {
        // Make sure tabs get initialized
        tabsInstance = M.Tabs.init(document.querySelectorAll(".tabs"), {
            onShow: updateTabInUrl,
        });
    },
    view: function (vnode) {
        return m(
            ".nav-content",
            m(
                "ul.tabs",
                vnode.attrs.tabs.map(function (tab) {
                    return m(
                        "li.tab",
                        m(
                            "a",
                            {
                                class: tab.isActive ? "active" : "",
                                href: tab.href,
                            },
                            tab.title,
                        ),
                    );
                }),
            ),
        );
    },
};

function updateTabInUrl(tab) {
    const data = m.route.param();

    let tabId;
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

    if (data["tab"] !== tabId) {
        if (tabId == null) {
            delete data.tab;
            m.route.set("/product/:id", data);
        } else {
            data["tab"] = tabId;
            m.route.set("/product/:id/:tab", data);
        }
    }
}

const ProductInfoCard = {
    view: function (vnode) {
        const product = vnode.attrs.product;
        if (product === null) return null;

        setMetaDescription(
            `${product.varenavn}: ${product.smak}${
                product.smak.endsWith(".") ? "" : "."
            } ${getExtendedProductMetadata(product)
                .map(({ name, value }) => name + value)
                .join("; ")}`,
        );

        return m(
            ".card white darken-1",
            m(
                ".product-card",
                m("img", {
                    src: `https://bilder.vinmonopolet.no/cache/1200x1200-0/${product.varenummer}-1.jpg`,
                    style: "height: 35vh",
                    alt: `Produktbilde for ${product.varenavn}`,
                }),
                m(
                    ".card-content black-text",
                    m("span.card-title", product.varenavn),
                    m("p", { style: { marginBottom: "20px" } }, product.smak),
                    m("p", m("b", "Alkoholprosent: "), product.alkohol + "%"),
                    m("p", m("b", "Volum: "), product.volum + " liter"),
                    m("p", m("b", "Pris: "), product.pris.toFixed(2) + ",-"),
                    m(
                        "p",
                        m("b", "Literspris: "),
                        (product.pris / product.volum).toFixed(2) + ",-",
                    ),
                    m(
                        "p",
                        m("b", "Alkohol per krone: "),
                        (
                            (((product.alkohol / 100) * product.volum) /
                                product.pris) *
                            1000000
                        ).toFixed(3) + " mikroliter",
                    ),
                    m(
                        "p",
                        m("b", "Først sett: "),
                        moment(product.first_seen).format("D. MMMM YYYY"),
                    ),
                    m(
                        "p",
                        m("b", "Sist sett: "),
                        moment(product.last_seen).format("D. MMMM YYYY"),
                    ),
                ),
            ),
            m(
                ".card-action grey lighten-4",
                m(
                    "a.vinmonopolet-link",
                    {
                        href:
                            "https://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-" +
                            product.varenummer,
                    },
                    "Finn på Vinmonopolet",
                ),
            ),
        );
    },
};

function getExtendedProductMetadata(
    product,
): { name: string; value: string }[] {
    const values = [];
    if (product.passer_til_1 !== null) {
        let fitsWith = product.passer_til_1;
        if (product.passer_til_2 !== null) {
            fitsWith += ", " + product.passer_til_2;
        }
        if (product.passer_til_3 !== null) {
            fitsWith += ", " + product.passer_til_3;
        }
        values.push({ name: "Passer til: ", value: fitsWith });
    }

    if (product.argang !== null) {
        values.push({ name: "År: ", value: product.argang });
    }
    if (product.rastoff !== null) {
        values.push({ name: "Råstoff: ", value: product.rastoff });
    }
    if (product.metode !== null) {
        values.push({ name: "Metode: ", value: product.metode });
    }
    if (product.sukker != null && product.sukker !== "Ukjent") {
        values.push({
            name: "Sukker: ",
            value: product.sukker / 100 + " gram per liter",
        });
    }
    if (product.syre != null && product.sukker !== "Ukjent") {
        values.push({
            name: "Syre: ",
            value: product.syre / 100 + " gram per liter",
        });
    }
    if (product.lagringsgrad !== null) {
        values.push({
            name: "Lagringsgrad: ",
            value: product.lagringsgrad,
        });
    }
    return values;
}

const ExtendedProductInfoCard = {
    product: null,
    view: function (vnode) {
        this.product = vnode.attrs.product;
        if (this.product === null) return null;

        return m(
            ".card blue",
            m(
                ".card-content white-text",
                m("span.card-title", "Tilleggsinformasjon"),
                getExtendedProductMetadata(this.product).map(function (pair) {
                    return m("p", m("b", pair.name), pair.value);
                }),
            ),
        );
    },
};

function selectCorrectTab() {
    let tabId;
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

const ProductView = {
    oninit: function (vnode) {
        productId = vnode.attrs.id;
        tab = vnode.attrs.tab;
        console.log(tab);
        Product.loadCurrent(productId).then(
            () => (this.product = Product.currentProduct),
        );
    },
    view: function (vnode) {
        console.log("view");

        return m(
            Layout /*{ tabs: tabs},*/,
            m(Tabs, { tabs: tabs }),
            m(
                ".container",
                m(
                    "#main_tab.col m12 s12",
                    this.product
                        ? m(
                              ".row",
                              m(
                                  ".col m6 s12",
                                  m(ProductInfoCard, {
                                      product: Product.currentProduct,
                                  }),
                              ),
                              m(
                                  ".col m6 s12",
                                  m(ExtendedProductInfoCard, {
                                      product: Product.currentProduct,
                                  }),
                              ),
                          )
                        : null,
                ),
                m(
                    "#price_tab.col m12 s12",
                    this.product
                        ? m(
                              ".row",
                              m(PriceHistoryCard, {
                                  product: Product.currentProduct,
                              }),
                          )
                        : null,
                ),
                m(
                    "#history_tab.col m12 s12",
                    this.product
                        ? m(ProductHistoryCard, {
                              history: Product.currentChanges,
                          })
                        : null,
                ),
            ),
        );
    },
    oncreate: function (vnode) {
        console.log("DOM created");
    },
    onupdate: function (vnode) {
        tab = vnode.attrs.tab;
        selectCorrectTab();
        console.log("onupdate");
        if (this.product != null) {
            document.title = `${this.product.varenavn} — VinDB`;
        }
    },
    onbeforeremove: function (vnode) {
        console.log("exit animation can start");
        return new Promise(function (resolve) {
            // call after animation completes
            resolve();
        });
    },
    onremove: function (vnode) {
        console.log("removing DOM element");
    },
    onbeforeupdate: function (vnode, old) {
        return true;
    },
};

export default ProductView;
