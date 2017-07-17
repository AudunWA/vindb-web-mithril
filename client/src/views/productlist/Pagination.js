var m = require("mithril");
var Product = require("../../models/Product");
var node = m("ul.pagination");

function onButtonClick(e) {
    e.preventDefault();

    var pageId = getCorrectPage(e.target);
    console.log(pageId);
    m.route.set("/products", {query: queryString, page: pageId});
    Product.loadList({query: queryString, page: pageId});
}

function getCorrectPage(target) {
    var child = target.firstChild;
    var value = target.innerText;
    if(child.innerText) {
        value = child.innerText;
    }

    switch (value) {
        case "chevron_left": // Previous
            return Product.currentPage - 1;
        case "first_page":
            return 1;
        case "chevron_right": // Next
            return Product.currentPage + 1;
        case "last_page":
            return Product.pageCount;
        default:
            return value;
    }
}

function generatePageNodes() {
    var start = Product.currentPage === 1 ? 1 : Product.currentPage - 1;
    var end = Product.currentPage === 1 ? 3 : Product.currentPage + 1;
    if(Product.currentPage === Product.pageCount) {
        start = Product.currentPage - 2;
    }
    if(Product.pageCount === 1) {
        { start = 1; end = 1; }
    }
    if(end > Product.pageCount) {
        end = Product.pageCount;
    }

    var nodes = [];
    for (var i = start; i <= end; i++) {
        nodes.push(m("li", { class: i === Product.currentPage ? "active" : "waves-effect"},
            m("a.page-button", i === Product.currentPage ? {} : { href: "/#!/products?page=" + i, onclick: onButtonClick }, i)
        ));
    }
    return nodes;
}
var test = null;
var Pagination = {
    view: function () {
        console.log("view");
        return m("ul.pagination", [
            m("li", { class: Product.currentPage === 1 ? "disabled" : "waves-effect"}, [
                m("a.page-first", Product.currentPage === 1 ? {} : { href: "/products", oncreate: m.route.link, onclick: onButtonClick }, m("i.material-icons", "first_page"))
            ]),
            m("li", { class: Product.currentPage === 1 ? "disabled" : "waves-effect"}, [
                m("a.page-previous", Product.currentPage === 1 ? {} : { test: "tsd", href: "/#!/products?page=" + (Product.currentPage - 1), onclick: onButtonClick }, m("i.material-icons", "chevron_left"))
            ]),
            generatePageNodes(),
            m("li", { class: Product.currentPage === Product.pageCount ? "disabled" : "waves-effect"}, [
                m("a.page-next", Product.currentPage === Product.pageCount ? {} : { href: "/#!/products?page=" + (Product.currentPage + 1), onclick: onButtonClick }, m("i.material-icons", "chevron_right"))
            ]),
            m("li", { class: Product.currentPage === Product.pageCount ? "disabled" : "waves-effect"}, [
                m("a.page-last", Product.currentPage === Product.pageCount? {} : { href: "/#!/products?page=" + Product.pageCount, onclick: onButtonClick }, m("i.material-icons", "last_page"))
            ])
        ]);
    },
    oninit: function(vnode) {
        console.log("initialized")
    },
    oncreate: function(vnode) {
        console.log("DOM created")
    },
    onupdate: function(vnode) {
        console.log("DOM updated")
        if(m.route.param() !== test) {
            Product.loadList(m.route.param());
        }
        test = m.route.param();
    },
    onbeforeremove: function(vnode) {
        console.log("exit animation can start")
        return new Promise(function(resolve) {
            // call after animation completes
            resolve()
        })
    },
    onremove: function(vnode) {
        console.log("removing DOM element")
    }
};



module.exports = Pagination;