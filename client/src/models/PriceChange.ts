import m from "mithril";

const PriceChange = {
    list: [],
    error: null,
    loadPriceChanges: function () {
        return m.request<object[]>({
            method: "GET",
            url: "/rest/pricechanges"
        })
            .then(function (result) {
                PriceChange.list = result;
            })
            .catch(function (e) {
                PriceChange.error = e.message;
            })
    },
    getPriceDifference: function (change) {
        const oldPrice = parseFloat(change.old_value.replace(",", "."));
        const newPrice = parseFloat(change.new_value.replace(",", "."));
        const percent = newPrice / oldPrice * 100;
        const delta = oldPrice - newPrice;
        return {delta: delta, percent: percent};
    }
};

export default PriceChange;