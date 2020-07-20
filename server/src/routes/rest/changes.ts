/**
 * Created by Audun on 29.12.2016.
 */
import express from "express";
import { query } from "../../app";
import squel from "squel";

const router = express.Router();

router.get("/", async (req, res, next) => {
    const fields = req.query.fields || "";
    const splittedFields = fields.toString().split(",");
    const validFields = [];
    for (let i = 0; i < splittedFields.length; i++) {
        const parsed = parseInt(splittedFields[i]);
        if (!isNaN(parsed)) {
            validFields.push(parsed);
        }
    }

    let squelQuery = squel
        .select()
        .fields(["product.varenavn", "product_change.*", "time"])
        .from("product_change")
        .join(
            "change_log",
            undefined,
            "change_log.change_id = product_change.change_id",
        )
        .join("product", undefined, "product.varenummer = product_id")
        .order("time", false)
        .order("product_id", false)
        .order("field_id", false)
        .limit(200);

    if (validFields.length > 0) {
        squelQuery.where("field_id IN ?", validFields.join());
    }

    if (!req.query.include_gtin) {
        squelQuery.where("field_id NOT IN (40,41)");
    }

    const { text: sql, values } = squelQuery.toParam();

    try {
        const rows = await query(sql, values);
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
});

export default router;
