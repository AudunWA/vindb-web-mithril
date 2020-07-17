import express from "express";
import async from "async";
import { pool } from "../../app";

const router = express.Router();
router.get("/:product_id", function (req, res, next) {
  const productId = req.params.product_id;
  // Get product from db
  async.waterfall(
    [getProduct.bind(null, productId), getChanges, renderPage.bind(null, res)],
    function (error) {
      if (error) {
        return next(error);
      }
    }
  );
});

function getProduct(productId, callback) {
  pool.query("SELECT * FROM product WHERE varenummer = ?", productId, function (
    err,
    rows,
    fields
  ) {
    if (err) {
      callback(err);
    } else if (rows.length === 0) {
      const err: any = new Error("Not Found");
      err.status = 404;
      callback(err);
    } else {
      callback(null, rows[0]);
    }
  });
}

function getChanges(product, callback) {
  pool.query(
    "SELECT field.display_name name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) WHERE product_id = ? ORDER BY time DESC",
    product.varenummer,
    function (err, rows, fields) {
      if (err) {
        callback(err);
      } else {
        callback(null, product, rows);
      }
    }
  );
}

function renderPage(res, product, changes, callback) {
  res.send({ product: product, changes: changes });
  callback(null);
}

export default router;
