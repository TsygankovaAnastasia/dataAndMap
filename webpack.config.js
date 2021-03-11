'use strict'
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './frontend/UserController.js',
    output: {

        path:path.resolve(__dirname, "./public"), // string (default)
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)
        filename: "build.js", // string (default)
        // the filename template for entry chunks
    },
    externals: ['graphql-fetch'],
};
