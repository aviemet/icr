import axios from "axios"
import { afterEach, describe, expect, it } from "vitest"

import { setupCSRFToken } from "@/entrypoints/middleware"

describe("setupCSRFToken", () => {
	afterEach(() => {
		document.head.innerHTML = ""
		delete axios.defaults.headers.common["X-CSRF-Token"]
	})

	it("sets the axios CSRF header from the meta tag", () => {
		const meta = document.createElement("meta")
		meta.name = "csrf-token"
		meta.content = "token-from-meta"
		document.head.append(meta)

		setupCSRFToken()

		expect(axios.defaults.headers.common["X-CSRF-Token"]).toBe("token-from-meta")
	})

	it("does not throw when the csrf meta tag is missing", () => {
		expect(() => setupCSRFToken()).not.toThrow()
		expect(axios.defaults.headers.common["X-CSRF-Token"]).toBeUndefined()
	})
})
