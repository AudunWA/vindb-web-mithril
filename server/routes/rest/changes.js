/**
 * Created by Audun on 29.12.2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var fields = req.query.fields || "";
    var splittedFields = fields.split(",");
    var validFields = [];
    for(var i = 0; i < splittedFields.length; i++) {
        var parsed = parseInt(splittedFields[i]);
        if(!isNaN(parsed)) {
            validFields.push(parsed);
        }
    }

    var validFieldsString = validFields.length > 0 ? "WHERE field_id IN(" + validFields.join() + ")" : "";

    pool.query("SELECT product.varenavn, product_change.*, time FROM product_change NATURAL JOIN change_log INNER JOIN product ON(product.varenummer = product_id) " + validFieldsString + " ORDER BY time DESC, product_id DESC, field_id DESC LIMIT 200", function(err, rows, fields) {
        if (err) {
            return next(err);
        }
        res.json(rows);
    });
});

module.exports = router;
