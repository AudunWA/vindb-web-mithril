import m from "mithril";
import moment from "moment";
import HistoryUtil from "../../controllers/HistoryUtil";
import Change from "../../models/Change";
import Layout from "../Layout";
import MaterialSelect from "../general/MaterialSelect";
let lastDate;
let loading = true;

function loadPriceChanges(fieldIds?: string[]) {
    loading = true;
    Change.loadChanges(fieldIds).then(() => {
        loading = false;
    });
}

function onFilterChange(e: any) {
    // https://stackoverflow.com/questions/11821261/how-to-get-all-selected-values-from-select-multiple-multiple#comment86548587_31544256
    const selectedFieldIds = Array.from(e.target.querySelectorAll("option:checked:not([disabled])"), (e: HTMLOptionElement) => e.value);
    loadPriceChanges(selectedFieldIds);
}

const PriceChanges = {
    oninit: function () {
        loadPriceChanges()
    },
    oncreate: function () {
        document.title = "Endringer - VinDB";
    },
    view: function () {
        if (loading) {
            return m(Layout,
                m(".container",
                    m("h2", "Alle endringer"),
                    m(MaterialSelect, {
                        multiple: true,
                        defaultText: "Velg type(r) endring",
                        optionGroups: HistoryUtil.optionGroups,
                        onchange: onFilterChange
                    }),
                    m(".progress", m(".indeterminate"))
                ));
        }
        return m(Layout, m(".container",
            m("h2", "Alle endringer"),
            m(MaterialSelect, {
                multiple: true,
                defaultText: "Velg type(r) endring",
                optionGroups: HistoryUtil.optionGroups,
                onchange: onFilterChange
            }),
            m("ul.collection.with-header",
                Change.list.map(function (change) {
                    const vnodes = [];
                    const date = moment(change.time).format('D. MMMM YYYY');

                    // Add date header if new date
                    if (date !== lastDate) {
                        vnodes.push(m("li.collection-header", m("h5", date)));
                        lastDate = date;
                    }

                    const beforeValue = change.field_id === 4 ? "" : "\"";
                    const afterValue = change.field_id === 4 ? ",-" : "\"";

                    let text = `Endret fra ${beforeValue}${change.old_value}${afterValue} til ${beforeValue}${change.new_value}${afterValue}`;
                    if (change.old_value == null || change.old_value.length === 0) {
                        text = `Satt til ${beforeValue}${change.new_value}${afterValue}`;
                    }
                    if (change.new_value == null || change.new_value.length === 0) {
                        text = `Fjernet verdi ${beforeValue}${change.old_value}${afterValue}`;
                    }

                    vnodes.push(m("li.collection-item.avatar",
                        m("i", {class: "material-icons circle yellow darken-3"}, HistoryUtil.getIconForChangeField(change.field_id)),
                        m("span.title", change.varenavn + " ", m(".chip.prefix", HistoryUtil.getNameForChangeField(change.field_id))),
                        m("p", text,
                            m("br"), m(m.route.Link, {
                                href: "/product/" + change.product_id,
                            }, "Gå til produkt")
                        )
                    ));
                    return vnodes;
                })
            )
        ));
    }
};

export default PriceChanges;