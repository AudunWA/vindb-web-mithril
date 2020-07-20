import m from "mithril";
import { PriceChange } from "@shared/types";

interface PriceChangeType {
    list: PriceChange[];
    error: string | null;
    loadPriceChanges: () => Promise<void>;
    getPriceDifference: (
        change: PriceChange,
    ) => { delta: number; percent: number };
}
const PriceChange: PriceChangeType = {
    list: [],
    error: null,
    loadPriceChanges: () =>
        m
            .request<PriceChange[]>({
                method: "GET",
                url: "/rest/pricechanges",
            })
            .then(function (result) {
                PriceChange.list = result;
            })
            .catch(function (e) {
                PriceChange.error = e.message;
            }),
    getPriceDifference: (change) => {
        const oldPrice = parseFloat(change.old_value.replace(",", "."));
        const newPrice = parseFloat(change.new_value.replace(",", "."));
        const percent = (newPrice / oldPrice) * 100;
        const delta = oldPrice - newPrice;
        return { delta: delta, percent: percent };
    },
};

export default PriceChange;
