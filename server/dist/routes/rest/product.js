"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const async_1 = __importDefault(require("async"));
const app_1 = require("../../app");
const router = express_1.default.Router();
router.get('/:product_id', function (req, res, next) {
    const productId = req.params.product_id;
    // Get product from db
    async_1.default.waterfall([
        getProduct.bind(null, productId),
        getChanges,
        renderPage.bind(null, res)
    ], function (error) {
        if (error) {
            return next(error);
        }
    });
});
function getProduct(productId, callback) {
    app_1.pool.query("SELECT * FROM product WHERE varenummer = ?", productId, function (err, rows, fields) {
        if (err) {
            callback(err);
        }
        else if (rows.length === 0) {
            const err = new Error('Not Found');
            err.status = 404;
            callback(err);
        }
        else {
            callback(null, rows[0]);
        }
    });
}
function getChanges(product, callback) {
    app_1.pool.query("SELECT field.display_name name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) WHERE product_id = ? ORDER BY time DESC", product.varenummer, function (err, rows, fields) {
        if (err) {
            callback(err);
        }
        else {
            callback(null, product, rows);
        }
    });
}
function renderPage(res, product, changes, callback) {
    res.send({ product: product, changes: changes });
    callback(null);
}
exports.default = router;
//# sourceMappingURL=product.js.map