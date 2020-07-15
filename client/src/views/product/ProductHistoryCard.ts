import m from "mithril";
import moment from "moment";

const ProductHistoryCard = {
    view: function (vnode) {
        const history = vnode.attrs.history;
        if (history === null) return null;

        let lastDate;
        return [m("h2", "Historikk"),
            m("ul.collection.with-header",
                history.map(function (row) {
                    const date = moment(row.time).format('D. MMMM YYYY');
                    const vnodes = [];
                    if (date !== lastDate) {
                        vnodes.push(m("li.collection-header", m("h5", date)));
                        lastDate = date;
                    }

                    const beforeValue = row.name === "Pris" ? "" : "\"";
                    const afterValue = row.name === "Pris" ? ",-" : "\"";

                    if (row.old_value == null || row.old_value.length === 0) {
                        vnodes.push(m("li.collection-item", m("b", row.name), " satt til " + beforeValue + row.new_value + afterValue));
                    } else {
                        vnodes.push(m("li.collection-item", m("b", row.name), " endret fra " + beforeValue + row.old_value + afterValue + " til " + beforeValue + row.new_value + afterValue));
                    }
                    return vnodes;
                })
            )];
    }
};

export default ProductHistoryCard;