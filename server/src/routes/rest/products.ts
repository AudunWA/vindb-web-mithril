import express from "express";
import squel from "squel";
import { query } from "../../app";
import { Product, ProductListResponse } from "@shared/types";

const router = express.Router();
const ALLOWED_ORDER_VALUES = [
    "epk",
    "literspris",
    "varenummer",
    "first_seen",
    "last_seen",
    "varenavn",
    "volum",
    "pris",
    "varetype",
    "produktutvalg",
    "butikkategori",
    "alkohol",
    "land",
];
const ALLOWED_QUERY_FIELDS = [
    "literspris",
    "varenummer",
    "first_seen",
    "last_seen",
    "varenavn",
    "volum",
    "pris",
    "varetype",
    "produktutvalg",
    "butikkategori",
    "alkohol",
    "land",
];
const ENTRIES_PER_PAGE = 100;

function calculateCurrentPage(queryPage: unknown, pageCount: number) {
    if (queryPage === "last") return pageCount;

    const page = Number(queryPage);
    if (Number.isInteger(page) && page >= 1 && page <= pageCount) return page;

    return 1;
}

router.get("/", async (req, res, next) => {
    const squelQuery = squel
        .select({ autoQuoteAliasNames: false })
        .field("*")
        .field("pris/volum", "literspris")
        .field("((alkohol/100*volum)/pris*1000000)", "epk")
        .from("product");

    // Search parameter
    if (req.query.query) {
        let queryField = "varenavn";
        if (
            req.query.query_type &&
            ALLOWED_QUERY_FIELDS.includes(req.query.query_type.toString())
        ) {
            queryField = req.query.query_type.toString();
        }

        squelQuery.where(queryField + " LIKE ?", "%" + req.query.query + "%");
    }

    // Custom order
    if (
        req.query.order_by &&
        ALLOWED_ORDER_VALUES.includes(req.query.order_by.toString())
    ) {
        const ascending = !req.query.desc || req.query.desc === "false";
        squelQuery.order(req.query.order_by.toString(), ascending);
    }

    // No alcohol free beverages
    if (req.query.above_zero) {
        squelQuery.where("alkohol > 0");
    }

    // Exclude expired
    if (!req.query.include_expired) {
        const lastChangeTime = await getLastChangeTime();
        squelQuery.where("last_seen = ?", lastChangeTime);
    }

    const pageCountQueryString = squelQuery.toParam();
    const pageCount = await getPageCount(
        pageCountQueryString.text,
        pageCountQueryString.values,
    );
    const page = calculateCurrentPage(req.query.page, pageCount);
    squelQuery.offset((page - 1) * ENTRIES_PER_PAGE).limit(ENTRIES_PER_PAGE);

    const queryString = squelQuery.toParam();
    console.log(queryString.text);
    console.dir(queryString.values);
    const rows: Product[] = await query(queryString.text, queryString.values);
    rows.forEach((product) => {
        if (product.literspris == null) {
            product.literspris = product.pris;
        }
    });

    const response: ProductListResponse = {
        products: rows,
        productsPerPage: ENTRIES_PER_PAGE,
        currentPage: page,
        pageCount: pageCount,
    };
    res.json(response);
});

async function getPageCount(queryText: string, params?: unknown[]) {
    queryText = queryText.replace("SELECT *", "SELECT COUNT(1) as count");
    const [result]: [{ count: number }] = await query(queryText, params);
    return Math.ceil(result.count / ENTRIES_PER_PAGE);
}

async function getLastChangeTime(): Promise<Date> {
    const [result]: [{ time: Date }] = await query(
        "SELECT MAX(time) as time FROM change_log",
    );
    return result.time;
}

export default router;
