const { environment } = require('@rails/webpacker')
const { merge } = require('lodash')

// module.exports = environment

module.exports = merge(environment, {
	module: {
		rules: [
			{
				test: /\.css$/,
				type: 'asset/resource',
				exclude: /node_modules/,
				use: ['style-loader', 'postcss-loader']
			},
			{
				test: /\.(tsx|jsx)?$/,
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