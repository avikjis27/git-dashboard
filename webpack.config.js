const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
    popup: [require.resolve('@babel/polyfill'), './src/popup/index.js'],
		background: [require.resolve('@babel/polyfill'), './src/background/index.js'],
		option: [require.resolve('@babel/polyfill'), './src/option/index.js']
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
			filename: 'popup.html',
			template: 'src/popup/index.html',
			chunks: ["popup"]
		}),
		new HtmlWebpackPlugin({
			filename: 'option.html',
			template: 'src/option/index.html',
			chunks: ["option"]
		}),
		new CopyPlugin({
      patterns: [
        { from: 'public', to: "." }
      ],
    })
	]

}


