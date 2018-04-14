const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    entry: {
        index: path.join(__dirname, 'src/index.js'),
        bin: path.join(__dirname, 'src/bin.js'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            include: 'bin',
            raw: true,
        })
    ],
    optimization: {
        noEmitOnErrors: true,
        namedModules: true,
        splitChunks: {
            name: 'common',
            filename: 'common.js',
        },
    },
    target: 'node',
}