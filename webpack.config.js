var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./src/components/app.tsx",
    output: {
        filename: "site.js",
        path: __dirname + "/public"
    },

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

    devtool: "false",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            }
        ]
    },
    // plugins: [
    //     new webpack.ProvidePlugin({
    //         "React": "react",
    //     }),
    // ],
    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
};