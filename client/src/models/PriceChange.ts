import m from "mithril";
import { ProductChange } from "@shared/types";

interface PriceChangeType {
    list: ProductChange[];
    error: string | null;
    loadPriceChanges: () => Promise<void>;
    getPriceDifference: (
        change: ProductChange,
    ) => { delta: number; percent: number };
}
const PriceChange: PriceChangeType = {
    list: [],
    error: null,
    loadPriceChanges: () =>
        m
            .request<ProductChange[]>({
                method: "GET",
                url: "/rest/changes?fields=4",
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
