import m from "mithril";
import Layout from "./views/Layout";
import Home from "./views/home/Home";
import ProductList from "./views/productlist/ProductList";
import Product from "./views/product/Product";
import PriceChanges from "./views/changes/PriceChanges";
import PriceChangesOld from "./views/changes/PriceChangesOld";
import AllChanges from "./views/changes/AllChanges";
// Define GA if adblock
if (window.ga == null) {
    window.ga = (() => {}) as any;
}

m.route.prefix = "";
m.route(document.body, "/", {
    "/": {
        render: function () {
            ga("set", "page", "/");
            ga("send", "pageview");
            return m(Layout, m(Home));
        },
    },
    "/products": {
        render: function () {
            ga("set", "page", "/products");
            ga("send", "pageview");
            return m(Layout, m(ProductList));
        },
    },
    "/product/:id/:tab": {
        render: function (vnode) {
            ga("set", "page", `/product/${vnode.attrs.id}/${vnode.attrs.tab}`);
            ga("send", "pageview");
            return m(Product, vnode.attrs);
        },
    },
    "/product/:id": {
        render: function (vnode) {
            ga("set", "page", `/product/${vnode.attrs.id}`);
            ga("send", "pageview");
            return m(Product, vnode.attrs);
        },
    },
    "/pricechanges": {
        render: function (vnode) {
            ga("set", "page", "/pricechanges");
            ga("send", "pageview");
            return m(PriceChanges, vnode.attrs);
        },
    },
    "/pricechangesold": {
        render: function (vnode) {
            ga("set", "page", "/pricechangesold");
            ga("send", "pageview");
            return m(PriceChangesOld, vnode.attrs);
        },
    },
    "/history": {
        render: function (vnode) {
            ga("set", "page", "/history");
            ga("send", "pageview");
            return m(AllChanges, vnode.attrs);
        },
    },
});
