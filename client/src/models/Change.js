var m = require("mithril");

var Change = {
    list: [],
    error: null,
    loadChanges: function (fieldIds) {
        var data = { };
        if(fieldIds) {
            data["fields"] = fieldIds.join();
        }
        return m.request({
            method: "GET",
            url: "/rest/changes",
            data: data
        })
            .then(function (result) {
                Change.list = result;
            })
            .catch(function (e) {
                Change.error = e.message;
            });
    },
    getPriceDifference: function (change) {
        var oldPrice = parseFloat(change.old_value.replace(",", "."));
        var newPrice = parseFloat(change.new_value.replace(",", "."));
        var percent = newPrice / oldPrice * 100;
        var delta = oldPrice - newPrice;
        return { delta: delta, percent: percent };
    }
};

module.exports = Change;