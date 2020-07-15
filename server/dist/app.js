"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
// Global debug flag
const changes_1 = __importDefault(require("./routes/rest/changes"));
// REST
const pricehistory_1 = __importDefault(require("./routes/rest/pricehistory"));
const product_1 = __importDefault(require("./routes/rest/product"));
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const pricechanges_1 = __importDefault(require("./routes/rest/pricechanges"));
const products_1 = __importDefault(require("./routes/rest/products"));
const mysql_1 = __importDefault(require("mysql"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
console.log("VinDB server starting!");
const app = express_1.default();
if (app.get('env') === 'development') {
    // Load environment variables from .env
    dotenv_1.config();
}
app.set('view engine', 'jade');
// set mysql config
exports.pool = mysql_1.default.createPool({
    connectionLimit: 15,
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: Number(process.env.RDS_PORT),
    database: process.env.RDS_DB_NAME
});
// Listen port
app.set('port', process.env.PORT || 3000);
// uncomment after placing your favicon in /public
app.use(serve_favicon_1.default(path_1.default.join(__dirname, '../../client/dist', 'favicon.ico')));
app.use(morgan_1.default('dev'));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
// REST
app.use('/rest/pricehistory', pricehistory_1.default);
app.use("/rest/products", product_1.default);
app.use("/rest/products", products_1.default);
app.use("/rest/pricechanges", pricechanges_1.default);
app.use("/rest/changes", changes_1.default);
// SPA
app.use("*", function (req, resp) {
    resp.sendFile("index.html", { root: path_1.default.join(__dirname, '../../client/dist') });
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
// Start listen
//if (app.get('env') != 'development') {
http_1.default.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
//}
exports.default = app;
//# sourceMappingURL=app.js.map