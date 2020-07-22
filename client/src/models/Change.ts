import m from "mithril";
import { ProductChange } from "@shared/types";

interface ChangeType {
    list: ProductChange[];
    error?: Error;
    loadChanges: (fieldIds?: string[]) => Promise<void>;
    getPriceDifference: (
        change: ProductChange,
    ) => { delta: number; percent: number };
}
const Change: ChangeType = {
    list: [],
    error: undefined,
    loadChanges: async (fieldIds?: string[]): Promise<void> => {
        const data: { fields?: string } = {};
        if (fieldIds) {
            data.fields = fieldIds.join();
        }
        try {
            Change.list = await m.request<ProductChange[]>({
                method: "GET",
                url: "/rest/changes",
                params: data,
            });
        } catch (e) {
            Change.error = e;
        }
    },
    getPriceDifference: (
        change: ProductChange,
    ): { delta: number; percent: number } => {
        const oldPrice = parseFloat(change.old_value.replace(",", "."));
        const newPrice = parseFloat(change.new_value.replace(",", "."));
        const percent = (newPrice / oldPrice) * 100;
        const delta = oldPrice - newPrice;
        return { delta: delta, percent: percent };
    },
};

export default Change;
