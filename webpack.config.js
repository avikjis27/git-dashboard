const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
    popup: [require.resolve('@babel/polyfill'), './src/popup/index.js'],
    background: [require.resolve('@babel/polyfill'), './src/background/index.js']
},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		rules: [
			{ test: /\.(js)$/, use: 'babel-loader' },
			{ test: /\.(css)$/, use: ['style-loader', 'css-loader'] }
		]
	},

	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: 'src/popup/index.html',
			chunks: ["popup"]
		}),
		new CopyPlugin({
      patterns: [
        { from: 'public', to: "." }
      ],
    })
	]

}


