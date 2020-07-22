import "module-alias/register";

// Global debug flag
import changes from "./routes/rest/changes";
// REST
import priceHistory from "./routes/rest/pricehistory";

import restProduct from "./routes/rest/product";
import sitemap from "./routes/sitemap";

import http from "http";

import express from "express";
import restProducts from "./routes/rest/products";
import mysql, { QueryOptions } from "mysql";
import bodyParser from "body-parser";
import logger from "morgan";
import favicon from "serve-favicon";
import path from "path";

import { config } from "dotenv";

import { promisify } from "util";

import compression from "compression";

console.log("VinDB server starting!");
const app = express();
if (app.get("env") === "development") {
    // Load environment variables from .env
    config();
}

app.use(compression());

// set mysql config
const pool = mysql.createPool({
    connectionLimit: 15,
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: Number(process.env.RDS_PORT),
    database: process.env.RDS_DB_NAME,
});

export function query<T = Record<string, unknown>>(
    query: string | QueryOptions,
    params?: unknown[] | unknown,
): Promise<[T]>;
export function query<T = Record<string, unknown>>(
    query: string | QueryOptions,
    params?: unknown[] | unknown,
): Promise<T[]> {
    return (promisify(pool.query).bind(pool) as any)(query, params);
}

// Listen port
app.set("port", process.env.PORT || 3000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "../../client/dist", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../../client/dist")));

// REST
app.use("/rest/pricehistory", priceHistory);
app.use("/rest/products", restProduct);
app.use("/rest/products", restProducts);
app.use("/rest/changes", changes);
app.use("/", sitemap);

// SPA
app.use("*", function (req, resp) {
    resp.sendFile("index.html", {
        root: path.join(__dirname, "../../client/dist"),
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err: any = new Error("Not Found");
    err.status = 404;
    next(err);
});

// Start listen
http.createServer(app).listen(app.get("port"), () => {
    console.log("Express server listening on port " + app.get("port"));
});

export default app;
