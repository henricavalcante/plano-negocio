'use strict';

var webpack = require('webpack');
var autoprefixer = require('autoprefixer-core');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function makeWebpackConfig(options) {

    var BUILD = !!options.BUILD;
    var config = {};

    config.entry = {
        app: './src/app.js'
    }

    config.output = {
        path: __dirname + '/dist/',
        publicPath: BUILD ? '' : 'http://localhost:8080/',
        filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

        chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
    }

    config.devtool = 'eval';

    config.module = {
        preLoaders: [],
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                cacheDirectory: true,
                presets: ['es2015', 'stage-2']
            }
        }, {
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            loader: 'file'
        }, {
            test: /\.html$/,
            loader: 'raw'
        },{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css?sourceMap!postcss')
        }]
    };

    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    config.plugins = [
        new ExtractTextPlugin('[name].[hash].css', {
            disable: !BUILD
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
            minify: false
        })
    ];

    if (BUILD) {
        config.plugins.push(
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        )
    }

    config.devServer = {
        contentBase: './dist',
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunk: false
        }
    };

    return config;
};
