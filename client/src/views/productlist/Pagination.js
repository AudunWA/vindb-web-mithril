var m = require("mithril");
var Product = require("../../models/Product");
var node = m("ul.pagination");


var Pagination = {
    view: function () {
        return m("ul.pagination", [
           m("li", { class: Product.currentPage === 1 ? 'disabled' : 'waves-effect'}, [
               m("a.page-first[href='#']", m("i.material-icons", "first_page"))
               ])
        ]);
    }
};

module.exports = Pagination;