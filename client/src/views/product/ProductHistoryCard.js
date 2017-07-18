var m = require("mithril");
var moment = require("moment");

var ProductHistoryCard = {
    view: function (vnode) {
        var history = vnode.attrs.history;
        if(history === null) return null;

        var lastDate;
        return [m("h2", "Historikk"),
            m("ul.collection.with-header",
                history.map(function (row) {
                    var date = moment(row.time).format('D. MMMM YYYY');
                    var vnodes = [];
                    if(date !== lastDate) {
                        vnodes.push(m("li.collection-header", m("h5", date)));
                        lastDate = date;
                    }

                    var beforeValue = row.name === "Pris" ? "" : "\"";
                    var afterValue = row.name === "Pris" ? ",-" : "\"";

                    if(!row.old_value) {
                        // No old value
                        vnodes.push(m("li.collection-item", m("b", row.name), " satt til " + beforeValue + row.new_value + afterValue));
                    } else {
                        vnodes.push(m("li.collection-item", m("b", row.name), " endret fra " + beforeValue + row.old_value + afterValue + " til " + beforeValue + row.new_value + afterValue));
                    }
                    return vnodes;
                })
            )];
    }
};

module.exports = ProductHistoryCard;