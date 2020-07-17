import m from "mithril";
import Product from "../../models/Product";
import Pagination from "./Pagination";
import { setMetaDescription } from "../../util/meta";

function objectEquals(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) {
        return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
        return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
        return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
        return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
        return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
        return false;
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
        return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
        return false;
    }
    if (!(y instanceof Object)) {
        return false;
    }

    // recursive object equality check
    var p = Object.keys(x);
    return (
        Object.keys(y).every(function (i) {
            return p.indexOf(i) !== -1;
        }) &&
        p.every(function (i) {
            return objectEquals(x[i], y[i]);
        })
    );
}

function onClickTableHeader(e) {
    const queryParameters = m.route.param();
    const newField = e.target.dataset.field;

    if (queryParameters.order_by === newField) {
        if (queryParameters.desc) {
        }
        queryParameters.desc = !queryParameters.desc;
    }
    queryParameters.order_by = newField;
    m.route.set("/products", queryParameters);
    Product.loadList(m.route.param());
}

const ProductList: m.Component<
    {},
    { queryString: string; prevParams: object }
> = {
    oninit: function (vnode) {
        vnode.state.queryString = m.route.param("query");
        Product.loadList(m.route.param());
    },
    oncreate: function (vnode) {
        const elems = document.querySelectorAll("select");
        const instances = M.FormSelect.init(elems);
        document.title = "Produkter — VinDB";
        setMetaDescription(
            "Oversikt over alle produkter i Vinmonopolets vareutvalg.",
        );
    },
    onbeforeupdate(vnode) {
        if (!objectEquals(m.route.param(), vnode.state.prevParams)) {
            vnode.state.prevParams = m.route.param();
            vnode.state.queryString = m.route.param("query");
            Product.loadList(m.route.param());
        }
    },
    view: function (vnode) {
        const onSearch = (e) => {
            e.preventDefault();
            const params = m.route.param();

            if (vnode.state.queryString != null) {
                params.query = vnode.state.queryString;
                delete params.page;
            }

            m.route.set("/products", params);
            Product.loadList(m.route.param());
        };
        return m(".container", [
            m(
                ".col s12",
                m(
                    ".row",
                    m("h2", "Varesøk"),
                    m(
                        "form.col s12",
                        {
                            // oninput: function (e) {
                            //     queryString = e.target.value;
                            //     if(typeof queryString !== "undefined" && queryString.length > 0) {
                            //         m.route.set("/products?query=" + queryString);
                            //     } else {
                            //         m.route.set("/products");
                            //     }
                            //     Product.loadList(queryString);
                            // },
                            onchange: (e) => {
                                vnode.state.queryString = e.target.value;
                            },
                            onsubmit: onSearch,
                        },
                        m(
                            ".row",
                            m(
                                ".input-field col s12",
                                m(
                                    "input#search[type='text'][required][placeholder='Søketekst']",
                                    { value: vnode.state.queryString },
                                ),
                                //m("label.label-icon[for='search']",
                                //m("i.material-icons", "search"))

                                //,
                                // m(".input-field col s6",
                                //     m("select", [
                                //         m("option[value=''][disabled][selected]", "Velg søketype"),
                                //         m("option[value='1']", "Varenavn"),
                                //         m("option[value='2']", "Produsent")
                                //     ])
                                // )
                                m(
                                    "button.waves-effect waves-light btn[type='submit'][name='searchButton']",
                                    "Søk",
                                ),
                            ),
                        ),
                    ),
                    m(Pagination),
                ),
                // m(".row",
                //     m(".chip",
                //         m("b", "Skanlog AS"), " (produsent)",
                //         m("i.close material-icons", "close")
                //     ),
                //     m(".chip",
                //         m("b", "Absolut vodka"), " (navn)",
                //         m("i.close material-icons", "close")
                //     ),
                //     m(".chip",
                //         m("b", "Brennevin"), " (type)",
                //         m("i.close material-icons", "close")
                //     )
                // )
            ),
            m("h4", "Resultater"),
            m(
                "table.bordered.highlight[data-role='table', data-mode='columntoggle']",
                [
                    m(
                        "thead",
                        m(
                            "tr",
                            {
                                onclick: function () {
                                    console.log("Test");
                                },
                            },
                            [
                                // m("th.clickable.hide-on-med-and-down[data-field='varenummer'][data-priority='4']", { onclick: onClickTableHeader }, "Varenummer"),
                                m(
                                    "th.clickable[data-field='varetype'][data-priority='7']",
                                    { onclick: onClickTableHeader },
                                    "Varetype",
                                ),
                                m(
                                    "th.clickable[data-field='varenavn'][data-priority='7']",
                                    { onclick: onClickTableHeader },
                                    "Varenavn",
                                ),
                                m(
                                    "th.clickable[data-field='volum'][data-priority='7']",
                                    { onclick: onClickTableHeader },
                                    "Volum",
                                ),
                                m(
                                    "th.clickable[data-field='pris'][data-priority='2']",
                                    { onclick: onClickTableHeader },
                                    "Pris",
                                ),
                                // m("th.clickable.hide-on-med-and-down[data-field='literspris'][data-priority='3']", { onclick: onClickTableHeader }, "Literspris"),
                                m(
                                    "th.clickable[data-field='alkohol'][data-priority='1']",
                                    { onclick: onClickTableHeader },
                                    "Alk. %",
                                ),
                                m(
                                    "th.clickable[data-field='epk'][data-priority='1']",
                                    { onclick: onClickTableHeader },
                                    "Alk. per kr",
                                ),
                                // m("th.clickable[data-field='first_seen'][data-priority='5']", { onclick: onClickTableHeader }, "Først sett"),
                                // m("th.clickable.hide-on-med-and-down[data-field='last_seen'][data-priority='6']", { onclick: onClickTableHeader }, "Sist sett"),
                            ],
                        ),
                    ),
                    m(
                        "tbody",
                        Product.list.map(function (product) {
                            return m(
                                "tr",
                                {
                                    key: product.varenummer,
                                    "data-href":
                                        "/product/" + product.varenummer,
                                },
                                [
                                    // m("td.hide-on-med-and-down", product.varenummer),
                                    m("td", product.varetype),
                                    m(
                                        "td",
                                        m(
                                            m.route.Link,
                                            {
                                                selector: "a.rowlink.no-style",
                                                href:
                                                    "/product/" +
                                                    product.varenummer,
                                            },
                                            product.varenavn,
                                        ),
                                    ),
                                    m("td", `${product.volum} liter`),
                                    m("td", product.pris + ",-"),
                                    // m("td.hide-on-med-and-down", product.literspris.toFixed(2) + ",-"),
                                    m("td", product.alkohol.toFixed(1) + "%"),
                                    m(
                                        "td",
                                        product.epk.toFixed(2) + " mikroliter",
                                    ),
                                    // m("td", moment(product.first_seen).format('D. MMMM YYYY')),
                                    // m("td.hide-on-med-and-down", moment(product.last_seen).format('D. MMMM YYYY'))
                                ],
                            );
                        }),
                    ),
                ],
            ),
        ]);
    },
};

export default ProductList;
