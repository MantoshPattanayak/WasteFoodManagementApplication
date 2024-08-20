const { json } = require('body-parser');
const path = require('path');
const { DefinePlugin } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        main: './backend/src/server.js'
    },
    output: {
        path: path.join(__dirname, 'dist', 'backend'),
        publicPath: '/',
        filename: '[name].js',
        clean: true
    },
    mode: 'production',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true
                }
            }
        })]
    },
    externals: [nodeExternals()], // Exclude node_modules from the bundle
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './path/to/your/index.html', // Replace with the actual path to your index.html file
    //         filename: 'index.html',
    //         inject: 'body',
    //     }),
    // ],
    plugins: [
        new DefinePlugin({
            API_VERSION             : JSON.stringify(process.env.API_VERSION),
            PORT                    : JSON.stringify(process.env.PORT),
            CORS_ORIGIN             : JSON.stringify(process.env.CORS_ORIGIN),
            Encrypt_Decrypt_key     : JSON.stringify(process.env.Encrypt_Decrypt_key),
            IV                      : JSON.stringify(process.env.IV),
            HOST                    : JSON.stringify(process.env.HOST),
            USER_NAME               : JSON.stringify(process.env.USER_NAME),
            PASSWORD                : JSON.stringify(process.env.PASSWORD),
            DATABASE                : JSON.stringify(process.env.DATABASE),
            DIALECT                 : JSON.stringify(process.env.DIALECT),
            UPLOAD_DIR              : JSON.stringify(process.env.UPLOAD_DIR),
            SECRETJWTKEY            : JSON.stringify(process.env.SECRETJWTKEY),
            GOOGLE_CLIENT_ID        : JSON.stringify(process.env.GOOGLE_CLIENT_ID),
            GOOGLE_CLIENT_SECRET    : JSON.stringify(process.env.GOOGLE_CLIENT_SECRET),
            RAZORPAY_API_KEY        : JSON.stringify(process.env.RAZORPAY_API_KEY),
            RAZORPAY_APT_SECRET     : JSON.stringify(process.env.RAZORPAY_APT_SECRET),
            ACCESS_TOKEN_SECRET     : JSON.stringify(process.env.ACCESS_TOKEN_SECRET),
            REFRESH_TOKEN_SECRET    : JSON.stringify(process.env.REFRESH_TOKEN_SECRET),
        })
    ]
};