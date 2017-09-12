import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './source/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry:{
        index: './source/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'docs')
    },
    // devtool: "source-maps",

    module: {
        loaders: [{
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query:
                {
                    presets:['es2015', 'react','stage-2']
                }
        },
            {
                test:/\.css$/,
                exclude: /node_modules/,
                //loaders:['style-loader'],
                loaders:"style-loader!css-loader?modules&importLoaders=1"
            },
            {
                test: /\.png$|\.gif$/,
                loader: 'url-loader?limit=100000'
            },
            {
                test: /\.jpg$/,
                loader: 'file-loader'
            },
            ]
    },    plugins: [HtmlWebpackPluginConfig]
}
