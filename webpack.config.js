var path = require("path");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, 'docs'),
        filename: "bundle.js",
    },
    resolve: {
        extensions: [".js", ".json", ".ts", ".d.ts"]
    },
    module: {
        loaders: [
            {
                test: /.ts$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    devServer: {
        publicPath: "/",
        contentBase: "./docs",
        hot: true
    }
}