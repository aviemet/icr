import path from "path"

import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vitest/config"

const frontendRoot = path.resolve(__dirname, "app", "frontend")

function stubLinariaCssModules(): Plugin {
	return {
		name: "stub-linaria-css-modules",
		enforce: "pre",
		transform(code, id) {
			const normalizedId = id.split("?")[0]
			if(!normalizedId.endsWith(".css.ts") && !normalizedId.endsWith(".editor.css.ts")) {
				return null
			}
			if(normalizedId.includes(`${path.sep}node_modules${path.sep}`)) {
				return null
			}

			const exportNames = [...code.matchAll(/export const (\w+)\s*=/g)].map((match) => match[1])
			if(exportNames.length === 0) {
				return {
					code: "export default {}\n",
					map: null,
				}
			}

			const fileToken = path.basename(normalizedId, ".ts").replace(/\./g, "_")
			const namedExports = exportNames
				.map((name) => `export const ${name} = ${JSON.stringify(`${fileToken}__${name}`)}`)
				.join("\n")

			return {
				code: `${namedExports}\n`,
				map: null,
			}
		},
	}
}

export default defineConfig({
	root: frontendRoot,
	base: "/",
	plugins: [
		stubLinariaCssModules(),
		react(),
	],
	resolve: {
		dedupe: ["axios"],
		tsconfigPaths: true,
		alias: {
			"@": frontendRoot,
		},
	},
	server: {
		fs: {
			strict: false,
		},
		watch: null,
	},
	test: {
		fileParallelism: true,
		globals: true,
		environment: "jsdom",
		execArgv: ["--no-webstorage"],
		pool: "forks",
		teardownTimeout: 2000,
		hookTimeout: 30000,
		coverage: {
			provider: "v8",
			include: [
				"components/**/*.{ts,tsx}",
				"domains/**/*.{ts,tsx}",
				"features/**/*.{ts,tsx}",
				"layouts/**/*.{ts,tsx}",
				"lib/**/*.{ts,tsx}",
				"pages/**/*.{ts,tsx}",
				"queries/**/*.{ts,tsx}",
				"store/**/*.{ts,tsx}",
			],
			exclude: [
				"tests/**",
				"**/*.{test,spec}.{ts,tsx}",
				"**/*.css.ts",
				"**/*.d.ts",
				"**/index.ts",
				"lib/locales/**",
				"types/**",
				"lib/routes/routes.js",
				"lib/routes/routes.d.ts",
				"lib/theme.ts",
				"lib/routes/urlParams.ts",
				"lib/routes/Routes.js",
			],
			reporter: ["text-summary", "json-summary", "lcov", "html"],
			reportsDirectory: path.resolve(__dirname, "coverage", "frontend"),
		},
		setupFiles: ["tests/helpers/mockServer.ts"],
	},
})
