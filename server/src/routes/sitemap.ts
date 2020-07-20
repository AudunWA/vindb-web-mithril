import { query } from "../app";

import { EnumChangefreq, SitemapStream, streamToPromise } from "sitemap";

import { createGzip } from "zlib";
import express from "express";
import moment from "moment";
import { Product } from "@shared/types";

let sitemap: Buffer;

const router = express.Router();
export default router;
router.get("/sitemap.xml", async function (req, res) {
    res.header("Content-Type", "application/xml");
    res.header("Content-Encoding", "gzip");
    // if we have a cached entry send it
    if (sitemap) {
        res.send(sitemap);
        return;
    }

    try {
        const smStream = new SitemapStream({
            hostname: "http://vindb.audun.me/",
        });
        const pipeline = smStream.pipe(createGzip());

        // pipe your entries or directly write them.
        smStream.write({ url: "/", changefreq: "monthly", priority: 0.8 });
        smStream.write({
            url: "/products",
            changefreq: "daily",
            priority: 0.7,
        });
        smStream.write({ url: "/history", changefreq: "daily", priority: 0.6 });
        smStream.write({
            url: "/pricechanges",
            changefreq: "daily",
            priority: 0.7,
        });

        const chooseChangeFreq = (lastSeen: Date): EnumChangefreq => {
            if (moment().diff(lastSeen, "month") > 1) {
                return EnumChangefreq.MONTHLY;
            } else {
                return EnumChangefreq.WEEKLY;
            }
        };
        const result: Pick<Product, "varenummer" | "last_seen">[] = await query(
            "SELECT varenummer, last_seen FROM product",
        );
        result.forEach(({ varenummer, last_seen }) =>
            smStream.write({
                url: `/product/${varenummer}`,
                changefreq: chooseChangeFreq(last_seen),
                lastmod: moment(last_seen).format("YYYY-MM-DD"),
            }),
        );

        // cache the response
        streamToPromise(pipeline).then((sm) => (sitemap = sm));
        // make sure to attach a write stream such as streamToPromise before ending
        smStream.end();
        // stream write the response
        pipeline.pipe(res).on("error", (e) => {
            throw e;
        });
    } catch (e) {
        console.error(e);
        res.status(500).end();
    }
});
