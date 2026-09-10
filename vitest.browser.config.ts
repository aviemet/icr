import path from "path"

import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const frontendRoot = path.resolve(__dirname, "app", "frontend")

const browserHeaded = ["1", "true", "yes"].includes(
	String(process.env.BROWSER_HEADED ?? "").toLowerCase(),
)

export default defineConfig({
	root: frontendRoot,
	base: "/",
	plugins: [react()],
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
	},
	css: { devSourcemap: false },
	test: {
		globals: true,
		fileParallelism: false,
		browser: {
			enabled: true,
			connectTimeout: 120_000,
			provider: playwright({
				launchOptions: {
					channel: "chromium",
					args: ["--disable-dev-shm-usage"],
				},
			}),
			headless: !browserHeaded,
			trace: "retain-on-failure",
			instances: [
				{ browser: "chromium" },
			],
		},
		setupFiles: ["tests/helpers/browserSetup.ts"],
		include: ["tests/**/*.browser.test.{ts,tsx}"],
	},
})
