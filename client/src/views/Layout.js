var m = require("mithril");

var Footer = require("./Footer");

var Tabs = {
    view: function (vnode) {
        return m(".nav-content",
            m("ul.tabs", vnode.attrs.tabs.map(function (tab) {
                    return m("li.tab", m("a",{ class: tab.isActive ? "active" : "", href: tab.href, oncreate: m.route.link }, tab.title))
                })
            )
        )
    }
};

module.exports = {
    oncreate: function (vnode) {
        // Make sure dropdown menu gets initialized
        $('.dropdown-button').dropdown();
    },
    view: function (vnode) {
        return [ m("header", m("ul.dropdown-content[id='dropdown1']",
            [
                m("li",
                    m("a[href='/products?order_by=first_seen&amp;desc=1']", {oncreate: m.route.link},
                        "Nyeste varer"
                    )
                ),
                m("li",
                    m("a[href='/products?order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                        "Billigste Alkohol/kr"
                    )
                ),
                m("li",
                    m("a[href='/products?order_by=epk&amp;above_zero=1']", {oncreate: m.route.link},
                        "Dyreste Alkohol/kr"
                    )
                ),
                m("li",
                    m("a[href='/products?query_type=varetype&amp;query=vodka&amp;order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                        "Billigste vodka"
                    )
                ),
                m("li",
                    m("a[href='/products?query_type=varetype&amp;query=vin&amp;order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                        "Billigste vin"
                    )
                ),
                m("li",
                    m("a[href='/products?query_type=varetype&amp;query=øl&amp;order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                        "Billigste øl"
                    )
                ),
                m("li",
                    m("a[href='/history?field_type=4']", {oncreate: m.route.link},
                        "Prisendringer"
                    )
                )
            ]
            ),
            m("div",
                m("nav",
                    m(".nav-wrapper",
                        [
                            //m("a.brand-logo[href='#']", "VinDB"),
                            m("ul.left.hide-on-med-and-down",
                                m("li", m("a[href='/']", {oncreate: m.route.link}, "Hjem", m("i.material-icons.left", "home"))),
                                m("li", m("a[href='/products']", {oncreate: m.route.link}, "Varer", m("i.material-icons.left", "local_drink"))),
                                m("li", m("a[href='/history']", {oncreate: m.route.link}, "Endringer", m("i.material-icons.left", "update"))),
                                m("li", m("a[href='/pricechanges']", {oncreate: m.route.link}, "Prisendringer", m("i.material-icons.left", "update"))),
                                m("li", m("a.dropdown-button[data-activates='dropdown1'][href='#']", "Topplister", m("i.material-icons.right", "arrow_drop_down"), m("i.material-icons.left", "sort")))
                            ),
                            m("a.button-collapse[data-activates='side-menu'][href='#']", m("i.material-icons", "menu")),
                            m("ul.side-nav[id='side-menu']",
                                [
                                    m("li.bold",
                                        m("a.waves-effect[href='/']", {oncreate: m.route.link},
                                            [
                                                "Hjem",
                                                m("i.material-icons.left",
                                                    "home"
                                                )
                                            ]
                                        )
                                    ),
                                    m("li.bold",
                                        m("a.waves-effect[href='/products']", {oncreate: m.route.link},
                                            [
                                                "Varer",
                                                m("i.material-icons.left",
                                                    "local_drink"
                                                )
                                            ]
                                        )
                                    ),
                                    m("li.bold",
                                        m("a.waves-effect[href='/history']", {oncreate: m.route.link},
                                            [
                                                "Endringer",
                                                m("i.material-icons.left",
                                                    "update"
                                                )
                                            ]
                                        )
                                    ),
                                    m("li.bold.no-padding",
                                        m("ul.collapsible.collapsible-accordion",
                                            m("li",
                                                [
                                                    m("a.waves-effect.collapsible-header",
                                                        [
                                                            "Topplister",
                                                            m("i.material-icons.left",
                                                                "sort"
                                                            )
                                                        ]
                                                    ),
                                                    m(".collapsible-body",
                                                        m("ul",
                                                            [
                                                                m("li",
                                                                    m("a[href='/products?order_by=first_seen&amp;desc=1']", {oncreate: m.route.link},
                                                                        "Nyeste varer"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m("a[href='/products?order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                                                                        "Billigste Alkohol/kr"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m("a[href='/products?order_by=epk&amp;above_zero=1']", {oncreate: m.route.link},
                                                                        "Dyreste Alkohol/kr"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m("a[href='/products?query_type=varetype&amp;query=vodka&amp;order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                                                                        "Billigste vodka"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m("a[href='/products?query_type=varetype&amp;query=vin&amp;order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                                                                        "Billigste vin"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m("a[href='/products?query_type=varetype&amp;query=øl&amp;order_by=epk&amp;desc=1']", {oncreate: m.route.link},
                                                                        "Billigste øl"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m("a[href='/history?field_type=4']", {oncreate: m.route.link},
                                                                        "Prisendringer"
                                                                    )
                                                                )
                                                            ]
                                                        )
                                                    )
                                                ]
                                            )
                                        )
                                    )
                                ]
                            ),
                            typeof vnode.attrs.tabs !== "undefined" ? m(Tabs, vnode.attrs) : null
                        ]
                    )
                )//,
// m("nav",
//     m(".nav-wrapper col s12",
//         m("form",
//             m(".input-field",
//                 m("input[id='search'][type='search'][required]"),
//                 m("label.label-icon[for='search']",
//                     m("i.material-icons", "search")
//                 ),
//                 m("i.material-icons", "close")
//             )
//         )
//     )
// )
            )),
            m("main", vnode.children),
            m(Footer)
        ];
    }
};
