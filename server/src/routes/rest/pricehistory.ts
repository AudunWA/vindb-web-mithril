/**
 * Created by Audun on 29.12.2016.
 */
import express from "express";

import squel from "squel";
import {pool} from "../../app";

const router = express.Router();
router.get('/:product_id', function(req, res, next) {
    const productId = req.params.product_id;
    pool.getConnection(function(err, connection) {
        if (err) {
            return next(err);
        }

        connection.query("SELECT old_value, new_value, time FROM product_change NATURAL JOIN change_log WHERE field_id = 4 AND product_id = ? ORDER BY time LIMIT 200", [productId], function(err, rows, fields) {
            connection.release();
            if (err) {
                return next(err);
            }
            res.json(rows);
        });
    });
});

export default router;
