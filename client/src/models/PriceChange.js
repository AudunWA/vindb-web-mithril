var m = require("mithril");

var PriceChange = {
    list: [],
    error: null,
    loadPriceChanges: function () {
        return m.request({
            method: "GET",
            url: "rest/pricechanges"
        })
            .then(function (result) {
                PriceChange.list = result;
            })
            .catch(function (e) {
                PriceChange.error = e.message;
            })
    },
    getPriceDifference: function (change) {
        var oldPrice = parseFloat(change.old_value.replace(",", "."));
        var newPrice = parseFloat(change.new_value.replace(",", "."));
        var percent = newPrice / oldPrice * 100;
        var delta = oldPrice - newPrice;
        return { delta: delta, percent: percent };
    }
};

module.exports = PriceChange;