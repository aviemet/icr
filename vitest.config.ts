import path from "path"

import { defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

export default mergeConfig(viteConfig, defineConfig({
	test: {
		globals: true,
		environment: "jsdom",
		coverage: {
			include: ["app/frontend/**/*.test.{ts,tsx}"],
		},
		setupFiles: [path.resolve(__dirname, "app/frontend/tests/helpers/mockServer.ts")],
	},
}))
