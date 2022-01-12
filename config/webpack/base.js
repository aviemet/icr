const { webpackConfig, merge } = require('@rails/webpacker')
// const util = require('util')

// const log = msg => console.log(util.inspect(msg, { showHidden: false, depth: null, colors: true }))

const customConfig = {
	resolve: {
		extensions: ['.css']
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx|mjs|ts|tsx|coffee)?(\.erb)?$/,
				include: [ '/Users/avram/Development/icr/app/javascript' ],
				exclude: /node_modules/,
				use: [
					{
						loader: '/Users/avram/Development/icr/node_modules/babel-loader/lib/index.js',
						options: {
							cacheDirectory: true,
							cacheCompression: false,
							compact: false
						}
					},
					{
						loader: 'astroturf/loader'
					}
				]
			},
			// {
			// 	test: /\.(jsx|tsx)$/i,
			// 	include: [ '/Users/avram/Development/icr/app/javascript' ],
			// 	exclude: /node_modules/,
			// 	use: [
			// 		{
			// 			loader: 'file-loader',
			// 			options: {
			// 				outputPath: 'build',
			// 				emitFile: true
			// 			}
			// 		},
			// 		{
			// 			loader: '/Users/avram/Development/icr/node_modules/babel-loader/lib/index.js',
			// 			options: {
			// 				cacheDirectory: true,
			// 				cacheCompression: false,
			// 				compact: false
			// 			}
			// 		}
			// 	]
			// }
		]
	}
}

webpackConfig.module.rules = webpackConfig.module.rules.filter(rule => rule.test.toString() !== /\.(js|jsx|mjs|ts|tsx|coffee)?(\.erb)?$/.toString())

module.exports = merge(webpackConfig, customConfig)