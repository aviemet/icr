import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

export default defineConfig({
	plugins: [
		RubyPlugin(),
		react(),
		dynamicImportVars({
			warnOnError: true
		}),
	],
	base: './',
})
