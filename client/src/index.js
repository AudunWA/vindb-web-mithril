var m = require("mithril");
var Layout = require("./views/Layout");
var Home = require("./views/home/Home");
var ProductList = require("./views/productlist/ProductList");
var Product = require("./views/product/Product");
var PriceChanges = require("./views/changes/PriceChanges");

// Define routes. Second argument is default/redirect route
m.route(document.body, "/", {
    "/": {
        render: function () {
            return m(Layout, m(Home));
        }
    },
    "/products": {
        render: function () {
            return m(Layout, m(ProductList));
        }
    }
    ,
    "/product/:id": {
        render: function (vnode) {
            return m(Product, vnode.attrs);
        }
    },
    "/pricechanges": PriceChanges
});