const { webpackConfig } = require('@rails/webpacker')
const { merge } = require('lodash')

module.exports = merge(webpackConfig, {
	module: {
		rules: [
			{
				test: /\.css$/,
				type: 'asset/resource',
				exclude: /node_modules/,
				use: ['style-loader', 'postcss-loader'],
				generator: {
					filename: '[name][ext][query]',
				},
			},
			{
				test: /\.jsx?$/,
				use: ['babel-loader', 'astroturf/loader'],
			}
		]
	},
	devServer: {
		client: {
			progress: false
		}
	}
})
