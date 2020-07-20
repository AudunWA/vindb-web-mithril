/**
 * Created by Audun on 29.12.2016.
 */
import express from "express";
import { query } from "../../app";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const rows = await query(
            "SELECT product.*, old_value, new_value, time FROM product_change NATURAL JOIN change_log INNER JOIN product ON(product.varenummer = product_id) WHERE field_id = 4 ORDER BY time DESC LIMIT 200",
        );
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
});

export default router;
