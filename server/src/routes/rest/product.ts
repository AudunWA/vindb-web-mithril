import express from "express";
import { query } from "../../app";
import { Product } from "../../../../shared/src/types";

const router = express.Router();
router.get("/:product_id", async (req, res, next) => {
    const productId = req.params.product_id;
    // Get product from db
    const [product, changes] = await Promise.all([
        getProduct(productId),
        getChanges(productId),
    ]);

    return res.json({ product, changes });
});

async function getProduct(productId): Promise<Product> {
    const [product] = await query(
        "SELECT * FROM product WHERE varenummer = ?",
        productId,
    );
    if (product == null) {
        const err: any = new Error("Not Found");
        err.status = 404;
        throw err;
    }
    return product as Product;
}

async function getChanges(productId) {
    return query(
        "SELECT field.display_name name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) WHERE product_id = ? ORDER BY time DESC",
        productId,
    );
}

export default router;
