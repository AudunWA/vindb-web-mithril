import m from "mithril";
import Footer from "./Footer";

const Tabs = {
    view: function (vnode) {
        return m(".nav-content",
            m("ul.tabs", vnode.attrs.tabs.map(function (tab) {
                    return m("li.tab", m(m.route.Link, {
                        class: tab.isActive ? "active" : "",
                        href: tab.href,
                    }, tab.title))
                })
            )
        )
    }
};

export default {
    oncreate: function (vnode) {
        // Init Materialize components
        M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
        M.Sidenav.init(document.querySelectorAll('.sidenav'));
        M.Collapsible.init(document.querySelectorAll('.collapsible'));
    },
    onupdate: function (vnode) {
        M.Sidenav.getInstance(document.querySelector(".sidenav")).close();
    },
    view: function (vnode) {
        return [m("header", m("ul.dropdown-content#dropdown1",
            [
                m("li",
                    m(m.route.Link, {href: "/products?order_by=first_seen&desc=1"},
                        "Nyeste varer"
                    )
                ),
                m("li",
                    m(m.route.Link, {href: "/products?order_by=epk&desc=1"},
                        "Billigste Alkohol/kr"
                    )
                ),
                m("li",
                    m(m.route.Link, {href: "/products?order_by=epk&above_zero=1"},
                        "Dyreste Alkohol/kr"
                    )
                ),
                m("li",
                    m(m.route.Link, {href: "/products?query_type=varetype&query=vodka&order_by=epk&desc=1"},
                        "Billigste vodka"
                    )
                ),
                m("li",
                    m(m.route.Link, {href: "/products?query_type=varetype&query=vin&order_by=epk&desc=1"},
                        "Billigste vin"
                    )
                ),
                m("li",
                    m(m.route.Link, {href: "/products?query_type=varetype&query=øl&order_by=epk&desc=1"},
                        "Billigste øl"
                    )
                )
            ]
            ),
            m("div",
                m("nav",
                    m(".nav-wrapper",
                        [
                            //m("a.brand-logo[href='#']", "VinDB"),
                            m("a.sidenav-trigger[data-target='side-menu'][href='#']", m("i.material-icons", "menu")),
                            m("ul.left.hide-on-med-and-down",
                                m("li", m(m.route.Link, {href: "/"}, "Hjem", m("i.material-icons.left", "home"))),
                                m("li", m(m.route.Link, {href: "/products"}, "Varer", m("i.material-icons.left", "local_drink"))),
                                m("li", m(m.route.Link, {href: "/history"}, "Endringer", m("i.material-icons.left", "update"))),
                                m("li", m(m.route.Link, {href: "/pricechanges"}, "Prisendringer", m("i.material-icons.left", "attach_money"))),
                                m("li", m("a.dropdown-trigger[data-target='dropdown1'][href='#!']", "Topplister", m("i.material-icons.right", "arrow_drop_down"), m("i.material-icons.left", "sort")))
                            ),
                            m("ul.sidenav[id='side-menu']",
                                [
                                    m("li.bold", m(m.route.Link, {selector: "a.waves-effect", "href": '/'}, "Hjem", m("i.material-icons.left", "home"))),
                                    m("li.bold", m(m.route.Link, {selector: "a.waves-effect", "href": '/products'}, "Varer", m("i.material-icons.left", "local_drink"))),
                                    m("li.bold", m(m.route.Link, {selector: "a.waves-effect", "href": '/history'}, "Endringer", m("i.material-icons.left", "update"))),
                                    m("li.bold", m(m.route.Link, {selector: "a.waves-effect", "href": '/pricechanges'}, "Prisendringer", m("i.material-icons.left", "attach_money"))),
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
                                                                    m(m.route.Link, {href: "/products?order_by=first_seen&desc=1"},
                                                                        "Nyeste varer"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m(m.route.Link, {href: "/products?order_by=epk&desc=1"},
                                                                        "Billigste Alkohol/kr"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m(m.route.Link, {href: "/products?order_by=epk&above_zero=1"},
                                                                        "Dyreste Alkohol/kr"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m(m.route.Link, {href: "/products?query_type=varetype&query=vodka&order_by=epk&desc=1"},
                                                                        "Billigste vodka"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m(m.route.Link, {href: "/products?query_type=varetype&query=vin&order_by=epk&desc=1"},
                                                                        "Billigste vin"
                                                                    )
                                                                ),
                                                                m("li",
                                                                    m(m.route.Link, {href: "/products?query_type=varetype&query=øl&order_by=epk&desc=1"},
                                                                        "Billigste øl"
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
