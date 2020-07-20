import express from "express";
import { query } from "../../app";
import { Product } from "@shared/types";

const router = express.Router();
router.get("/:product_id", async (req, res, next) => {
    const productId = Number(req.params.product_id);
    if (!Number.isInteger(productId)) {
        throw new Error("Invalid product_id");
    }

    // Get product from db
    const [product, changes] = await Promise.all([
        getProduct(productId),
        getChanges(productId),
    ]);

    return res.json({ product, changes });
});

async function getProduct(productId: number): Promise<Product> {
    const [product]: Product[] = await query(
        "SELECT * FROM product WHERE varenummer = ?",
        productId,
    );
    if (product == null) {
        const err: any = new Error("Not Found");
        err.status = 404;
        throw err;
    }
    return product;
}

async function getChanges(productId: number) {
    return query(
        "SELECT field.display_name name, pc.old_value, pc.new_value, cl.time FROM product_change pc INNER JOIN field USING(field_id) INNER JOIN change_log cl USING(change_id) WHERE product_id = ? ORDER BY time DESC",
        productId,
    );
}

export default router;
