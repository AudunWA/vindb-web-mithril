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
router.get('/', (req, res, next) => {
    const fields = req.query.fields || "";
    const splittedFields = fields.toString().split(",");
    const validFields = [];
    for (let i = 0; i < splittedFields.length; i++) {
        const parsed = parseInt(splittedFields[i]);
        if (!isNaN(parsed)) {
            validFields.push(parsed);
        }
    }
    const validFieldsString = validFields.length > 0 ? "WHERE field_id IN(" + validFields.join() + ")" : "";
    app_1.pool.query("SELECT product.varenavn, product_change.*, time FROM product_change NATURAL JOIN change_log INNER JOIN product ON(product.varenummer = product_id) " + validFieldsString + " ORDER BY time DESC, product_id DESC, field_id DESC LIMIT 200", function (err, rows, fields) {
        if (err) {
            return next(err);
        }
        res.json(rows);
    });
});
exports.default = router;
//# sourceMappingURL=changes.js.map