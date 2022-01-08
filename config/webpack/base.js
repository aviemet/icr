const { webpackConfig } = require('@rails/webpacker')

webpackConfig.module.rules.push(
	{
		test: /\.less$/,
		use: [{
			loader: 'less-loader'
		}]
	}
)

module.exports = webpackConfig
