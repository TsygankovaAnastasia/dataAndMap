'use strict'
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: './public/main.js',
    output: {

        path:path.resolve(__dirname, "./public"),
        filename: "build.js",
    },
      plugins: [
    // fix "process is not defined" error:
    // (do "npm install process" before running the build)
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
      ],

    watch: true,
};
