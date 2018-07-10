var m = require("mithril");
var Layout = require("./views/Layout");
var Home = require("./views/home/Home");
var ProductList = require("./views/productlist/ProductList");
var Product = require("./views/product/Product");
var PriceChanges = require("./views/changes/PriceChanges");
var PriceChangesOld = require("./views/changes/PriceChangesOld");
var AllChanges = require("./views/changes/AllChanges");

// Define GA if adblock
if(window.ga == null) {
    window.ga = function(args) {

    };
}

// Define routes. Second argument is default/redirect route
m.route.prefix("");
m.route(document.body, "/", {
    "/": {
        render: function () {
            ga('set', 'page', '/');
            ga('send', 'pageview');
            return m(Layout, m(Home));
        }
    },
    "/products": {
        render: function () {
            ga('set', 'page', '/products');
            ga('send', 'pageview');
            return m(Layout, m(ProductList));
        }
    }
    ,
    "/product/:id/:tab": {
        render: function (vnode) {
            ga('set', 'page', `/product/${vnode.attrs.id}/${vnode.attrs.tab}`);
            ga('send', 'pageview');
            return m(Product, vnode.attrs);
        }
    },
    "/product/:id": {
        render: function (vnode) {
            ga('set', 'page', `/product/${vnode.attrs.id}`);
            ga('send', 'pageview');
            return m(Product, vnode.attrs);
        }
    },
    "/pricechanges": {
        render: function (vnode) {
            ga('set', 'page', '/pricechanges');
            ga('send', 'pageview');
            return m(PriceChanges, vnode.attrs);
        }
    },
    "/pricechangesold": {
        render: function (vnode) {
            ga('set', 'page', '/pricechangesold');
            ga('send', 'pageview');
            return m(PriceChangesOld, vnode.attrs);
        }
    },
    "/history": {
        render: function (vnode) {
            ga('set', 'page', '/history');
            ga('send', 'pageview');
            return m(AllChanges, vnode.attrs);
        }
    },
});