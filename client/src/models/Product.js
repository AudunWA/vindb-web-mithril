var m = require("mithril");

var Product = {
    query: null,
    productsPerPage: 0,
    currentPage: 1,
    pageCount: 1,
    list: [],
    error: null,
    currentProduct: null,
    currentChanges: null,

    loadList: function (parameters) {
        return m.request({
            method: "GET",
            url: "rest/products",
            data: parameters
        })
            .then(function (result) {
                Product.list = result.products;
                Product.productsPerPage = result.entriesPerPage;
                Product.currentPage = result.currentPage;
                Product.pageCount = result.pageCount;
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