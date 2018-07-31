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
    // https://stackoverflow.com/questions/11821261/how-to-get-all-selected-values-from-select-multiple-multiple
    console.log($(e.target).val());
    loadPriceChanges($(e.target).val());
}

var PriceChanges = {
    oninit: function() { loadPriceChanges() },
    onupdate: function() {
        console.log("update");
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

                        var priceDifference = 10; //Change.getPriceDifference(change);
                        var percent = (priceDifference.percent - 100).toFixed(0);
                        var colorClass = percent > 0 ? "red lighten-1" : "green lighten-1";

                        if (percent == 0) {
                            return null;
                        }
                        vnodes.push(m("li.collection-item.avatar",
                            m("i", {class: "material-icons circle yellow darken-3" }, HistoryUtil.getIconForChangeField(change.field_id)),
                            m("span.title", change.varenavn + " ", m(".chip.prefix", HistoryUtil.getNameForChangeField(change.field_id))),
                            m("p", "Endret fra " + change.old_value + " til " + change.new_value,
                                m("br"), m("a", {
                                    href: "/product/" + change.product_id,
                                    oncreate: m.route.link
                                }, "Gå til produkt")
                            )
                        ));
                        return vnodes;
                    }
                )
            )
        ));
    }
};

module.exports = PriceChanges;