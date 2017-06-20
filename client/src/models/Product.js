var m = require("mithril");

var Product = {
    query: null,
    currentPage: 1,
    list: [],
    error: null,
    currentProduct: null,
    currentChanges: null,

    loadList: function (query) {
        var urlAdd = typeof query !== "undefined" && query.length > 0 ? "?query=" + query : "";
        return m.request({
            method: "GET",
            url: "rest/products" + urlAdd
        })
            .then(function (result) {
                Product.list = result.products;
            })
            .catch(function (e) {
                Product.error = e.message;
            })
    },
    loadCurrent: function (productId) {
        return m.request({
            method: "GET",
            url: "rest/products/" + productId
        })
            .then(function (result) {
                Product.currentProduct = result.product;
                Product.currentChanges = result.changes;
            })
            .catch(function (e) {
                Product.error = e.message;
            })
    },
    loadPriceHistory: function(productId) {
        return m.request({
            method: "GET",
            url: "rest/pricehistory/" + productId
        })
            .catch(function (e) {
                Product.error = e.message;
            })
    }
};

module.exports = Product;