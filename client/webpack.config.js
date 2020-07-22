const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    context: __dirname, // to automatically find tsconfig.json
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: false,
                    projectReferences: true,
                },
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "static", to: "./" }],
        }),
        // new ForkTsCheckerWebpackPlugin({
        //     // eslint: {
        //     //     files: './src/**/*.{ts,tsx,js,jsx}' // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
        //     // }
        //     // typescript: {
        //     //     enabled: true,
        //     //     build: true,
        //     // },
        //     // logger: { infrastructure: "console", issues: "console" },
        // }),
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            "@shared": path.resolve(__dirname, "../shared/src/"),
        },
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
};
