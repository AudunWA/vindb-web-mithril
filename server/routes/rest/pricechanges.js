/**
 * Created by Audun on 29.12.2016.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    if (err) {
      return next(err);
    }

    connection.query("SELECT product.*, old_value, new_value, time FROM product_change NATURAL JOIN change_log INNER JOIN product ON(product.varenummer = product_id) WHERE field_id = 4 ORDER BY time DESC LIMIT 200", function(err, rows, fields) {
      if (err) {
        return next(err);
      }
      res.json(rows);
    });
  });
});

module.exports = router;