"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Created by Audun on 29.12.2016.
 */
const express_1 = __importDefault(require("express"));
const app_1 = require("../../app");
const router = express_1.default.Router();
router.get('/', function (req, res, next) {
    app_1.pool.getConnection(function (err, connection) {
        if (err) {
            return next(err);
        }
        connection.query("SELECT product.*, old_value, new_value, time FROM product_change NATURAL JOIN change_log INNER JOIN product ON(product.varenummer = product_id) WHERE field_id = 4 ORDER BY time DESC LIMIT 200", function (err, rows, fields) {
            connection.release();
            if (err) {
                return next(err);
            }
            res.json(rows);
        });
    });
});
exports.default = router;
//# sourceMappingURL=pricechanges.js.map