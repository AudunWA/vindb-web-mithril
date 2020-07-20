/**
 * Created by Audun on 29.12.2016.
 */
import express from "express";

import { query } from "../../app";

const router = express.Router();
router.get("/:product_id", async (req, res, next) => {
    const productId = req.params.product_id;
    try {
        const rows = await query(
            "SELECT old_value, new_value, time FROM product_change NATURAL JOIN change_log WHERE field_id = 4 AND product_id = ? ORDER BY time LIMIT 200",
            productId,
        );
        return res.json(rows);
    } catch (e) {
        return next(e);
    }
});

export default router;
