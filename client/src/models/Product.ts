import m from "mithril";
import * as types from "../../../shared/src/types";
interface ProductModel {
    pageCount: number;
    loadPriceHistory: (productId) => Promise<unknown>;
    query: string | null;
    loadCurrent: (productId) => Promise<void>;
    loadList: (parameters) => Promise<void>;
    productsPerPage: number;
    currentPage: number;
    list: types.Product[];
    error: string | null;
    currentProduct: types.Product | null;
    currentChanges: object[] | null;
}
const Product: ProductModel = {
    query: null,
    productsPerPage: 0,
    currentPage: 1,
    pageCount: 1,
    list: [],
    error: null,
    currentProduct: null,
    currentChanges: null,

    loadList: function (parameters) {
        return m
            .request<{
                products: types.Product[];
                currentPage: number;
                entriesPerPage: number;
                pageCount: number;
            }>({
                method: "GET",
                url: "/rest/products",
                params: parameters,
            })
            .then(function (result) {
                result.products.forEach((product) => {
                    if (product.literspris == null) {
                        product.literspris = 0;
                    }
                    if (product.sukker !== "Ukjent") {
                        product.sukker = Number(
                            String(product.sukker).replace(",", "."),
                        );
                    }
                });
                Product.list = result.products;
                Product.productsPerPage = result.entriesPerPage;
                Product.currentPage = result.currentPage;
                Product.pageCount = result.pageCount;
            })
            .catch(function (e) {
                Product.error = e.message;
            });
    },
    loadCurrent: function (productId) {
        return m
            .request<{ product: any; changes: any[] }>({
                method: "GET",
                url: "/rest/products/" + productId,
            })
            .then(function (result) {
                if (result.product.literspris == null) {
                    result.product.literspris = 0;
                }
                if (result.product.sukker !== "Ukjent") {
                    result.product.sukker = Number(
                        String(result.product.sukker).replace(",", "."),
                    );
                }

                Product.currentProduct = result.product;
                Product.currentChanges = result.changes;
            })
            .catch(function (e) {
                Product.error = e.message;
            });
    },
    loadPriceHistory: function (productId) {
        return m
            .request({
                method: "GET",
                url: "/rest/pricehistory/" + productId,
            })
            .catch(function (e) {
                Product.error = e.message;
            });
    },
};

export default Product;
