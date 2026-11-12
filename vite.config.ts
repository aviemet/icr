import path from "path"

import inertia from "@inertiajs/vite"
import react from "@vitejs/plugin-react"
import wyw from "@wyw-in-js/vite"
import { defineConfig } from "vite"
import FullReload from "vite-plugin-full-reload"
import RubyPlugin from "vite-plugin-ruby"

export default defineConfig((env) => ({
	build: {
		sourcemap: true,
	},
	plugins: [
		RubyPlugin(),
		inertia(),
		FullReload(["config/routes.rb", "app/views/**/*"], { delay: 200 }),
		react(),
		wyw({
			include: ["**/*.{ts,tsx}"],
		}),
	],
	resolve: {
		dedupe: ["axios"],
		tsconfigPaths: true,
		alias: {
			"@": path.resolve(import.meta.dirname, "app", "frontend"),
		},
	},
	base: "./",
	server: {
		fs: {
			strict: false,
		},
	},
}))

