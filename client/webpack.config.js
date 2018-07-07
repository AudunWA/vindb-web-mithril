module.exports = {
    entry: './src/index.js',
    output: {
        filename: './bin/app.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    devtool: 'source-map'
};