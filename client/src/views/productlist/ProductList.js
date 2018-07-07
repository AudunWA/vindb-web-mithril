var m = require("mithril");
var Product = require("../../models/Product");
var Pagination = require("./Pagination");
var moment = require("moment");

function onSearch(e) {
    e.preventDefault();
    var params = m.route.param();

    if(typeof queryString !== "undefined") {
        params.query = queryString;
    }

    m.route.set("/products", params);
    //Product.loadList(m.route.param());
}

function onClickTableHeader(e) {
    const queryParameters = m.route.param();
    const newField = e.target.dataset.field;

    if(queryParameters.order_by === newField) {
        if(queryParameters.desc) {

        }
        queryParameters.desc = !queryParameters.desc;
    }
    queryParameters.order_by = newField;
    m.route.set("/products", queryParameters);
}

var ProductList = {
    queryString: "",
    oninit: function (vnode) {
        this.queryString = m.route.param("query");
        Product.loadList(m.route.param());
    },
    oncreate: function (vnode) {
        var elems = document.querySelectorAll('select');
        var instances = M.FormSelect.init(elems);
    },
    view: function () {
        return m(".container", [
            m(".col s12",
                m(".row",
                    m("h2", "Varesøk"),
                    m("form.col s12", {
                            // oninput: function (e) {
                            //     queryString = e.target.value;
                            //     if(typeof queryString !== "undefined" && queryString.length > 0) {
                            //         m.route.set("/products?query=" + queryString);
                            //     } else {
                            //         m.route.set("/products");
                            //     }
                            //     Product.loadList(queryString);
                            // },
                            onchange: function (e) {
                                this.queryString = e.target.value;
                            },
                            onsubmit: onSearch
                        },
                        m(".row",
                            m(".input-field col s12",
                                m("input#search[type='text'][required][placeholder='Søketekst']", { value: this.queryString })
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
                            ,m("button.waves-effect waves-light btn[type='submit'][name='searchButton']", "Søk"))
                        )
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
            m("table.bordered.highlight[data-role='table', data-mode='columntoggle']", [
                m("thead",
                    m("tr", { onclick: function () {
                        console.log("Test");
                    } }, [
                        // m("th.clickable.hide-on-med-and-down[data-field='varenummer'][data-priority='4']", { onclick: onClickTableHeader }, "Varenummer"),
                        m("th.clickable[data-field='varetype'][data-priority='7']", { onclick: onClickTableHeader }, "Varetype"),
                        m("th.clickable[data-field='varenavn'][data-priority='7']", { onclick: onClickTableHeader }, "Varenavn"),
                        m("th.clickable[data-field='volum'][data-priority='7']", { onclick: onClickTableHeader }, "Volum"),
                        m("th.clickable[data-field='pris'][data-priority='2']", { onclick: onClickTableHeader }, "Pris"),
                        // m("th.clickable.hide-on-med-and-down[data-field='literspris'][data-priority='3']", { onclick: onClickTableHeader }, "Literspris"),
                        m("th.clickable[data-field='alkohol'][data-priority='1']", { onclick: onClickTableHeader }, "Alk. %"),
                        m("th.clickable[data-field='epk'][data-priority='1']", { onclick: onClickTableHeader }, "Alk. per kr"),
                        // m("th.clickable[data-field='first_seen'][data-priority='5']", { onclick: onClickTableHeader }, "Først sett"),
                        // m("th.clickable.hide-on-med-and-down[data-field='last_seen'][data-priority='6']", { onclick: onClickTableHeader }, "Sist sett"),
                    ])
                ),
                m("tbody", Product.list.map(function (product) {
                    return m("tr", { key: product.varenummer, "data-href": "/product/" + product.varenummer }, [
                        // m("td.hide-on-med-and-down", product.varenummer),
                        m("td", product.varetype),
                        m("td", m("a.rowlink.no-style", { href: "/product/" + product.varenummer, oncreate: m.route.link }, product.varenavn)),
                        m("td", `${product.volum} liter`),
                        m("td", product.pris + ",-"),
                        // m("td.hide-on-med-and-down", product.literspris.toFixed(2) + ",-"),
                        m("td", product.alkohol.toFixed(1) + "%"),
                        m("td", product.epk.toFixed(2) + " mikroliter"),
                        // m("td", moment(product.first_seen).format('D. MMMM YYYY')),
                        // m("td.hide-on-med-and-down", moment(product.last_seen).format('D. MMMM YYYY'))
                    ]);
                }))
            ])
        ]);
    }
};

module.exports = ProductList;