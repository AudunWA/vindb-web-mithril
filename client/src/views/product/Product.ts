import m from "mithril";
import moment from "moment";
import Product from "../../models/Product";
import * as types from "../../../../shared/src/types";
import Layout from "../Layout";
import PriceHistoryCard from "./PriceHistoryCard";
import ProductHistoryCard from "./ProductHistoryCard";
import { setCanonicalUrl, setMetaDescription } from "../../util/searchEngines";

// Set moment locale
moment.locale("nb");

let productId: number;
let tab: string;

const tabs = [
    { isActive: true, title: "Produkt", href: "#main_tab" },
    { isActive: false, title: "Prisgraf", href: "#price_tab" },
    { isActive: false, title: "Historikk", href: "#history_tab" },
];

const Tabs: m.Component<{
    tabs: { isActive: boolean; href: string; title: string }[];
}> = {
    oncreate: function () {
        // Make sure tabs get initialized
        M.Tabs.init(document.querySelectorAll(".tabs"), {
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

function updateTabInUrl(tab: HTMLElement) {
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

function generateMetaDescription(product: types.Product): string {
    let description = product.varenavn;
    if (product.smak != null && product.smak.trim().length > 0) {
        description += ": " + product.smak;
        if (!product.smak.endsWith(".")) {
            description += ".";
        }
    } else {
        description += ".";
    }

    const extendedProductMetadata = getExtendedProductMetadata(product);
    if (extendedProductMetadata.length > 0) {
        description +=
            " " +
            extendedProductMetadata
                .map(({ name, value }) => name + value)
                .join("; ") +
            ".";
    }

    description += " Finnes på Vinmonopolet.";
    return description;
}

const ProductInfoCard: m.Component<{ product: types.Product }> = {
    view: function (vnode) {
        const product = vnode.attrs.product;
        if (product === null) return null;

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
                    m("p", m("b", "Alkoholprosent: "), `${product.alkohol}%`),
                    m("p", m("b", "Volum: "), `${product.volum} liter`),
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
                        href: `https://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${product.varenummer}`,
                    },
                    "Finn på Vinmonopolet",
                ),
            ),
        );
    },
};

function getExtendedProductMetadata(
    product: types.Product,
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
        values.push({ name: "År: ", value: product.argang.toString() });
    }
    if (product.rastoff !== null) {
        values.push({ name: "Råstoff: ", value: product.rastoff.toString() });
    }
    if (product.metode !== null) {
        values.push({ name: "Metode: ", value: product.metode.toString() });
    }
    if (product.sukker != null && product.sukker !== "Ukjent") {
        values.push({
            name: "Sukker: ",
            value: `${product.sukker} gram per liter`,
        });
    }
    if (product.syre != null) {
        values.push({
            name: "Syre: ",
            value: `${product.syre / 100} gram per liter`,
        });
    }
    if (product.lagringsgrad !== null) {
        values.push({
            name: "Lagringsgrad: ",
            value: product.lagringsgrad.toString(),
        });
    }
    return values;
}

const ExtendedProductInfoCard: m.Component<{
    product: types.Product | null;
}> = {
    view: (vnode) => {
        const { product } = vnode.attrs;
        if (product === null) return null;

        return m(
            ".card blue",
            m(
                ".card-content white-text",
                m("span.card-title", "Tilleggsinformasjon"),
                getExtendedProductMetadata(product).map(function (pair) {
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

const ProductView: m.Component<
    { id: number; tab: "main" | "price" | "history" },
    {
        tab: "main" | "price" | "history";
        product: types.Product | null;
    }
> = {
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

        if (this.product == null) return null;

        return [
            m(Tabs, { tabs }),
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
                                      product: this.product,
                                  }),
                              ),
                              m(
                                  ".col m6 s12",
                                  m(ExtendedProductInfoCard, {
                                      product: this.product,
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
                                  product: this.product,
                              }),
                          )
                        : null,
                ),
                m(
                    "#history_tab.col m12 s12",
                    Product.currentChanges
                        ? m(ProductHistoryCard, {
                              history: Product.currentChanges,
                          })
                        : null,
                ),
            ),
        ];
    },
    onupdate: function (vnode) {
        tab = vnode.attrs.tab;
        selectCorrectTab();
        if (this.product != null) {
            document.title = `${this.product.varenavn} — VinDB`;
            setCanonicalUrl(
                `http://vindb.audun.me/product/${this.product.varenummer}`,
            );
            setMetaDescription(generateMetaDescription(this.product));
        }
    },
};

export default ProductView;
