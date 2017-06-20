var m = require("mithril");
var Product = require("../../models/Product");
var Pagination = require("./Pagination");

function onSearch(e) {
    e.preventDefault();
    if(typeof queryString !== "undefined") {
        m.route.set("/products?query=" + queryString);
    } else {
        m.route.set("/products");
    }
    Product.loadList(queryString);
}

var ProductList = {
    queryString: "",
    oninit: function (vnode) {
        queryString = m.route.param("query");
        Product.loadList(queryString);
        $(document).ready(function() {
            $('select').material_select();
        });
    },
    view: function () {
        return m(".container", [
            m(".col s12",
                m(".row",
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
                                queryString = e.target.value;
                            },
                            onsubmit: onSearch
                        },
                        m(".row",
                            m(".input-field col s6",
                                m("input[id='search'][type='search'][required]", { value: queryString }),
                                m("label.label-icon[for='search']",
                                    m("i.material-icons", "search")
                                )
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
                    )
                ),
                m(".row",
                    m(".chip",
                        "Produsert av Skanlog AS",
                        m("i.close material-icons", "close")
                    ),
                    m(".chip",
                        "Absolut vodka",
                        m("i.close material-icons", "close")
                    ),
                    m(".chip",
                        "Brennevin",
                        m("i.close material-icons", "close")
                    )
                )
            ),
            m(Pagination),
            m("table.ui-responsive.bordered.highlight[data-role='table', data-mode='columntoggle']", [
                m("thead",
                    m("tr", [
                        m("th.clickable[data-field='varenummer'][data-priority='4']", "Varenummer"),
                        m("th.clickable[data-field='varenavn'][data-priority='7']", "Varenavn"),
                        m("th.clickable[data-field='pris'][data-priority='2']", "Pris"),
                        m("th.clickable[data-field='literspris'][data-priority='3']", "Literspris"),
                        m("th.clickable[data-field='epk'][data-priority='1']", "EPK"),
                        m("th.clickable[data-field='first_seen'][data-priority='5']", "Først sett"),
                        m("th.clickable[data-field='last_seen'][data-priority='6']", "Sist sett"),
                    ])
                ),
                m("tbody", Product.list.map(function (product) {
                    return m("tr.clickable-row", { key: product.varenummer, "data-href": "/product/" + product.varenummer }, [
                        m("td", m("a", { href: "/product/" + product.varenummer, oncreate: m.route.link }, product.varenummer)),
                        m("td", product.varenavn),
                        m("td", product.pris + ",-"),
                        m("td", product.literspris.toFixed(2) + ",-"),
                        m("td", product.epk.toFixed(2) + " mikroliter"),
                        m("td", product.first_seen),
                        m("td", product.last_seen)
                    ]);
                }))
            ])
        ]);
    }
};

module.exports = ProductList;