import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry:{
        index: './src/index.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname,'dist')
    },

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
                loaders:['style-loader','css-loader']}]},    plugins: [HtmlWebpackPluginConfig]
}
