process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const webpackConfig = require('./base')

// const chokidar = require('chokidar')
// webpackConfig.devServer.before = (app, server) => {
// 	chokidar.watch([
// 		'app/views/**/*.html.erb',
// 		'app/assets/stylesheets/**/*/css'
// 	]).on('change', () => server.sockWrite(server.sockets, 'content-changed'))
// }

module.exports = webpackConfig
