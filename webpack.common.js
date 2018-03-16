const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({ filename: 'app.css' });
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: [__dirname + '/src/index.js', __dirname + '/src/app.scss', 'webpack-hot-middleware/client'],
    output: {
        path: __dirname + '/build',
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /.scss$/,
                use: extractSass.extract({
                    use: [{loader: 'css-loader'}, {loader: 'sass-loader'}],
                    fallback: 'style-loader'
                })
            }
        ]
    },
    plugins: [
        extractSass,
        // new HtmlWebpackPlugin({
        // template: __dirname + '/src/index.html'
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ]
}
