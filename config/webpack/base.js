const { webpackConfig } = require('@rails/webpacker')
const { merge } = require('lodash')

module.exports = merge(webpackConfig, {
	module: {
		rules: [{
			test: /\.less$/,
			use: [{
				loader: 'less-loader'
			}]
		}]
	},
	devServer: {
		client: {
			progress: false
		}
	}
})
