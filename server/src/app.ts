// Global debug flag
import changes from "./routes/rest/changes";
// REST
import priceHistory from "./routes/rest/pricehistory";

import restProduct from "./routes/rest/product";
import sitemap from "./routes/sitemap";

import http from "http";

import express from "express";
import priceChanges from "./routes/rest/pricechanges";
import restProducts from "./routes/rest/products";
import mysql from "mysql";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
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

app.use(compression);
app.set("view engine", "jade");

// set mysql config
export const pool = mysql.createPool({
  connectionLimit: 15,
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: Number(process.env.RDS_PORT),
  database: process.env.RDS_DB_NAME,
});

export const query = promisify(pool.query).bind(pool);

// Listen port
app.set("port", process.env.PORT || 3000);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, "../../client/dist", "favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../client/dist")));

// REST
app.use("/rest/pricehistory", priceHistory);
app.use("/rest/products", restProduct);
app.use("/rest/products", restProducts);
app.use("/rest/pricechanges", priceChanges);
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

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render("error", {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: {},
  });
});

// Start listen
//if (app.get('env') != 'development') {
http.createServer(app).listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
//}

export default app;
