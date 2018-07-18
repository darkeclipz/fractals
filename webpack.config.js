const path = require('path');
const webpack = require('webpack');

module.exports =   
{
    entry: './app.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader?silent=true',
                exclude: /node_modules/
            },
            {
                test: /three\/examples\/js/,
                use: 'imports-loader?THREE=three'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname)
    },
    plugins: [
    ]
};