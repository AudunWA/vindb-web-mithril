import m from "mithril";

const Product = {
    query: null,
    productsPerPage: 0,
    currentPage: 1,
    pageCount: 1,
    list: [],
    error: null,
    currentProduct: null,
    currentChanges: null,

    loadList: function (parameters) {
        return m.request<{products: any[], currentPage: number; entriesPerPage: number, pageCount: number;}>({
            method: "GET",
            url: "/rest/products",
            params: parameters
        })
            .then(function (result) {
                result.products.forEach(product => {
                    if (product.literspris == null) {
                        product.literspris = 0;
                    }
                });
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
        return m.request<{product: any, changes: any[]}>({
            method: "GET",
            url: "/rest/products/" + productId
        })
            .then(function (result) {
                Product.currentProduct = result.product;
                Product.currentChanges = result.changes;
            })
            .catch(function (e) {
                Product.error = e.message;
            })
    },
    loadPriceHistory: function (productId) {
        return m.request({
            method: "GET",
            url: "/rest/pricehistory/" + productId
        })
            .catch(function (e) {
                Product.error = e.message;
            })
    }
};

export default Product;