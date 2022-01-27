import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [
		RubyPlugin(),
		tsConfigPaths({
			loose: true,
			extensions: ['.jpg', '.svg', '.png']
		})
	],
	base: './',
})
