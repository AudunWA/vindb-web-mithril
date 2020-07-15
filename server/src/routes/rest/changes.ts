/**
 * Created by Audun on 29.12.2016.
 */
import express from "express";
import {pool} from "../../app";

const router = express.Router();

router.get('/', (req, res, next) => {
    const fields = req.query.fields || "";
    const splittedFields = fields.toString().split(",");
    const validFields = [];
    for(let i = 0; i < splittedFields.length; i++) {
        const parsed = parseInt(splittedFields[i]);
        if(!isNaN(parsed)) {
            validFields.push(parsed);
        }
    }

    const validFieldsString = validFields.length > 0 ? "WHERE field_id IN(" + validFields.join() + ")" : "";

    pool.query("SELECT product.varenavn, product_change.*, time FROM product_change NATURAL JOIN change_log INNER JOIN product ON(product.varenummer = product_id) " + validFieldsString + " ORDER BY time DESC, product_id DESC, field_id DESC LIMIT 200", function(err, rows, fields) {
        if (err) {
            return next(err);
        }
        res.json(rows);
    });
});

export default router;
