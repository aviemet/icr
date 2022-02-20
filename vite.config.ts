import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'

const config = defineConfig({
	plugins: [
		tsconfigPaths(),
		RubyPlugin(),
		react(),
	],
	base: './',
})

export default config
