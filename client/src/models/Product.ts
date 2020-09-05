import m from "mithril";
import * as types from "@shared/types";
import { PriceChangeListResponse } from "@shared/types";

interface ProductModel {
    pageCount: number;
    loadPriceHistory: (productId: number) => Promise<types.PriceChange[]>;
    query: string | null;
    loadCurrent: (productId: number) => Promise<void>;
    loadList: (parameters: string[]) => Promise<void>;
    productsPerPage: number;
    currentPage: number;
    list: types.Product[];
    error: string | null;
    currentProduct: types.Product | null;
    currentChanges: types.ProductChange[] | null;
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
            .request<types.ProductListResponse>({
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
                Product.productsPerPage = result.productsPerPage;
                Product.currentPage = result.currentPage;
                Product.pageCount = result.pageCount;
            })
            .catch(function (e) {
                Product.error = e.message;
            });
    },
    loadCurrent: function (productId) {
        return m
            .request<{
                product: types.Product;
                changes: types.ProductChange[];
            }>({
                method: "GET",
                url: `/rest/products/${productId}`,
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
            .request<PriceChangeListResponse>({
                method: "GET",
                url: `/rest/pricehistory/${productId}`,
            })
            .catch<PriceChangeListResponse>(function (e) {
                Product.error = e.message;
                return [];
            });
    },
};

export default Product;
