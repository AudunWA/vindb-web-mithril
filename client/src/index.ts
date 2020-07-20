import m from "mithril";
import Layout from "./views/Layout";
import Home from "./views/home/Home";
import ProductList from "./views/productlist/ProductList";
import Product from "./views/product/Product";
import PriceChanges from "./views/changes/PriceChanges";
import PriceChangesOld from "./views/changes/PriceChangesOld";
import AllChanges from "./views/changes/AllChanges";
import { sharedPrintClient } from "@shared/types";

// Define GA if adblock
if (window.ga == null) {
    window.ga = ((() => {
        // Do nothing
    }) as unknown) as UniversalAnalytics.ga;
}

sharedPrintClient();
m.route.prefix = "";
m.route(document.body, "/", {
    "/": {
        render: () => {
            ga("set", "page", "/");
            ga("send", "pageview");
            return m(Layout, m(Home));
        },
    },
    "/products": {
        render: () => {
            ga("set", "page", "/products");
            ga("send", "pageview");
            return m(Layout, m(ProductList));
        },
    },
    "/product/:id/:tab": {
        render: (
            vnode: m.Vnode<{ id: number; tab: "main" | "price" | "history" }>,
        ) => {
            ga("set", "page", `/product/${vnode.attrs.id}/${vnode.attrs.tab}`);
            ga("send", "pageview");
            return m(Layout, m(Product, vnode.attrs));
        },
    },
    "/product/:id": {
        render: (
            vnode: m.Vnode<{ id: number; tab: "main" | "price" | "history" }>,
        ) => {
            ga("set", "page", `/product/${vnode.attrs.id}`);
            ga("send", "pageview");
            return m(Layout, m(Product, vnode.attrs));
        },
    },
    "/pricechanges": {
        render: () => {
            ga("set", "page", "/pricechanges");
            ga("send", "pageview");
            return m(Layout, m(PriceChanges));
        },
    },
    "/pricechangesold": {
        render: () => {
            ga("set", "page", "/pricechangesold");
            ga("send", "pageview");
            return m(Layout, m(PriceChangesOld));
        },
    },
    "/history": {
        render: () => {
            ga("set", "page", "/history");
            ga("send", "pageview");
            return m(Layout, m(AllChanges));
        },
    },
});
