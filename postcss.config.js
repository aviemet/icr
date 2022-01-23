module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-flexbugs-fixes'),
		require('postcss-nesting'),
		require('autoprefixer'),
		require('postcss-preset-env')({
			features: { 'nesting-rules': false },
			autoprefixer: {
				flexbox: 'no-2009'
			},
			stage: 3
		})
	]
}
