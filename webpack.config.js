'use strict'
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './client/main.js',
    output: {

        path:path.resolve(__dirname, "./client"),
        filename: "build.js",
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, // instead of style-loader
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ],
};
