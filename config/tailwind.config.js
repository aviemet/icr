const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	mode: 'jit',
	content: [
		'./app/helpers/**/*.rb',
		'./app/javascript/**/*.js',
		'./app/javascript/**/*.jsx',
		'./app/javascript/**/*.ts',
		'./app/javascript/**/*.tsx',
		'./app/views/**/*'
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter var', ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('@vechaiui/core'),
	]
}
