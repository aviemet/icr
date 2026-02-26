import { describe, it, expect } from "vitest"

import { encodeId, decodeId } from "@/lib/uuid"

describe("encodeId", () => {
	it("encodes model and id to base64 string", () => {
		const encoded = encodeId("User", 42)
		expect(typeof encoded).toBe("string")
		expect(encoded.length).toBeGreaterThan(0)
	})

	it("produces decodable output", () => {
		const encoded = encodeId("Client", 123)
		const decoded = decodeId(encoded)
		expect(decoded.model).toBe("Client")
		expect(decoded.id).toBe("123")
	})
})

describe("decodeId", () => {
	it("decodes encoded id back to model and id", () => {
		const encoded = encodeId("Shift", 7)
		const { model, id } = decodeId(encoded)
		expect(model).toBe("Shift")
		expect(id).toBe("7")
	})
})
