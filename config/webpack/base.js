const { webpackConfig, merge } = require('@rails/webpacker')
// const util = require('util')
// const { resolve } = require('path')

// const log = msg => console.log(util.inspect(msg, { showHidden: false, depth: null, colors: true }))

// // Filter out the rule we'll be replacing
// webpackConfig.module.rules = webpackConfig.module.rules.filter(rule => rule.test.toString() !== /\.(js|jsx|mjs|ts|tsx|coffee)?(\.erb)?$/.toString())

// // Add
// const customConfig = merge(webpackConfig, {
// 	resolve: {
// 		extensions: ['.css']
// 	},
// 	module: {
// 		rules: [
// 			{
// 				test: /\.(js|jsx|mjs|ts|tsx|coffee)?(\.erb)?$/,
// 				include: [ resolve(__dirname, '../../app/javascript') ],
// 				exclude: /node_modules/,
// 				use: [
// 					{
// 						loader: resolve(__dirname, '../../node_modules/babel-loader/lib/index.js'),
// 						options: {
// 							cacheDirectory: true,
// 							cacheCompression: false,
// 							compact: false
// 						}
// 					},
// 					{
// 						loader: 'astroturf/loader'
// 					}
// 				]
// 			}
// 		]
// 	}
// })


webpackConfig.module.rules.find(rule => rule.test.toString() === /\.(js|jsx|mjs|ts|tsx|coffee)?(\.erb)?$/.toString())
	.use.push({ loader: 'astroturf/loader' })


module.exports = webpackConfig