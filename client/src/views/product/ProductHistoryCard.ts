import m from "mithril";
import moment, { Moment } from "moment";
import { ProductChange } from "@shared/types";

const ProductHistoryCard: m.Component<{ history: ProductChange[] }> = {
    view: function (vnode) {
        const history = vnode.attrs.history;
        if (history === null) return null;

        let lastDate: Moment;
        return [
            m("h2", "Historikk"),
            m(
                "ul.collection.with-header",
                history.map(function (change) {
                    const vnodes: m.Vnode[] = [];
                    const date = moment(change.time);

                    // Add date header if new date
                    if (!date.isSame(lastDate, "date")) {
                        vnodes.push(m("li.collection-header", m("h5", date)));
                        lastDate = date;
                    }

                    const beforeValue = change.name === "Pris" ? "" : '"';
                    const afterValue = change.name === "Pris" ? ",-" : '"';

                    if (
                        change.old_value == null ||
                        change.old_value.length === 0
                    ) {
                        vnodes.push(
                            m(
                                "li.collection-item",
                                m("b", change.name),
                                " satt til " +
                                    beforeValue +
                                    change.new_value +
                                    afterValue,
                            ),
                        );
                    } else {
                        vnodes.push(
                            m(
                                "li.collection-item",
                                m("b", change.name),
                                " endret fra " +
                                    beforeValue +
                                    change.old_value +
                                    afterValue +
                                    " til " +
                                    beforeValue +
                                    change.new_value +
                                    afterValue,
                            ),
                        );
                    }
                    return vnodes;
                }),
            ),
        ];
    },
};

export default ProductHistoryCard;
