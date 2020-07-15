import m from "mithril";

const Change = {
    list: [],
    error: null,
    loadChanges: function (fieldIds) {
        const data: {fields?: string[]} = {};
        if (fieldIds) {
            data.fields = fieldIds.join();
        }
        return m.request<object[]>({
            method: "GET",
            url: "/rest/changes",
            params: data
        })
            .then(function (result) {
                Change.list = result;
            })
            .catch(function (e) {
                Change.error = e.message;
            });
    },
    getPriceDifference: function (change) {
        const oldPrice = parseFloat(change.old_value.replace(",", "."));
        const newPrice = parseFloat(change.new_value.replace(",", "."));
        const percent = newPrice / oldPrice * 100;
        const delta = oldPrice - newPrice;
        return {delta: delta, percent: percent};
    }
};

export default Change;