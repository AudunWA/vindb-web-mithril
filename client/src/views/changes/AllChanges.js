var m = require("mithril");
var moment = require("moment");

var HistoryUtil = require("../../controllers/HistoryUtil");

var Change = require("../../models/Change");

var Layout = require("../Layout");
var MaterialCard = require("../general/MaterialCard");
var MaterialSelect = require("../general/MaterialSelect");

//var first = true;
var lastDate;
var loading = true;

function loadPriceChanges(fieldIds) {
    loading = true;
    Change.loadChanges(fieldIds).then(function () {
        loading = false;
    });
}

function onFilterChange(e) {
    // https://stackoverflow.com/questions/11821261/how-to-get-all-selected-values-from-select-multiple-multiple#comment86548587_31544256
    const selectedFieldIds = Array.from(e.target.querySelectorAll("option:checked:not([disabled])"), e => e.value);
    loadPriceChanges(selectedFieldIds);
}

var PriceChanges = {
    oninit: function() { loadPriceChanges() },
    oncreate: function () {
        document.title = "Endringer - VinDB";
    },
    view: function () {
        if(loading) {
            return m(Layout,
                m(".container",
                    m("h2", "Alle endringer"),
                    m(MaterialSelect, { multiple: true, defaultText: "Velg type(r) endring", optionGroups: HistoryUtil.optionGroups, onchange: onFilterChange }),
                    m(".progress", m(".indeterminate"))
                ));
        }
        return m(Layout, m(".container",
            m("h2", "Alle endringer"),
            m(MaterialSelect, { multiple: true, defaultText: "Velg type(r) endring", optionGroups: HistoryUtil.optionGroups, onchange: onFilterChange }),
            m("ul.collection.with-header",
                Change.list.map(function (change) {
                    var vnodes = [];
                    var date = moment(change.time).format('D. MMMM YYYY');

                    // Add date header if new date
                    if(date !== lastDate) {
                        vnodes.push(m("li.collection-header", m("h5", date)));
                        lastDate = date;
                    }

                    var beforeValue = change.field_id === 4 ? "" : "\"";
                    var afterValue = change.field_id === 4 ? ",-" : "\"";

                    var text = `Endret fra ${beforeValue}${change.old_value}${afterValue} til ${beforeValue}${change.new_value}${afterValue}`;
                    if(change.old_value == null || change.old_value.length === 0) {
                        text = `Satt til ${beforeValue}${change.new_value}${afterValue}`;
                    }
                    if(change.new_value == null || change.new_value.length === 0) {
                        text = `Fjernet verdi ${beforeValue}${change.old_value}${afterValue}`;
                    }

                    vnodes.push(m("li.collection-item.avatar",
                        m("i", {class: "material-icons circle yellow darken-3" }, HistoryUtil.getIconForChangeField(change.field_id)),
                        m("span.title", change.varenavn + " ", m(".chip.prefix", HistoryUtil.getNameForChangeField(change.field_id))),
                        m("p", text,
                            m("br"), m("a", {
                                href: "/product/" + change.product_id,
                                oncreate: m.route.link
                            }, "Gå til produkt")
                        )
                    ));
                    return vnodes;
                })
            )
        ));
    }
};

module.exports = PriceChanges;