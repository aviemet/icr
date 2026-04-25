import { describe, it, expect } from "vitest"

import {
	HTTP_STATUS,
	matchesStatus,
	HttpStatusError,
	assertStatus,
} from "@/lib/http"

describe("matchesStatus", () => {
	it("returns true when status matches single expected code", () => {
		expect(matchesStatus(200, HTTP_STATUS.OK)).toBe(true)
	})

	it("returns false when status does not match single expected code", () => {
		expect(matchesStatus(201, HTTP_STATUS.OK)).toBe(false)
	})

	it("returns true when status is in expected array", () => {
		expect(matchesStatus(200, [HTTP_STATUS.OK, HTTP_STATUS.CREATED])).toBe(true)
		expect(matchesStatus(201, [HTTP_STATUS.OK, HTTP_STATUS.CREATED])).toBe(true)
	})

	it("returns false when status is not in expected array", () => {
		expect(matchesStatus(204, [HTTP_STATUS.OK, HTTP_STATUS.CREATED])).toBe(false)
	})
})

describe("HttpStatusError", () => {
	it("extends Error and has status property", () => {
		const err = new HttpStatusError("Bad", 400)
		expect(err).toBeInstanceOf(Error)
		expect(err.message).toBe("Bad")
		expect(err.status).toBe(400)
		expect(err.name).toBe("HttpStatusError")
	})
})

describe("assertStatus", () => {
	it("does not throw when status matches single expected", () => {
		expect(() => assertStatus({ status: 200 }, HTTP_STATUS.OK)).not.toThrow()
	})

	it("does not throw when status is in expected array", () => {
		expect(() => assertStatus({ status: 201 }, [HTTP_STATUS.OK, HTTP_STATUS.CREATED])).not.toThrow()
	})

	it("throws HttpStatusError when status does not match", () => {
		expect(() => assertStatus({ status: 500 }, HTTP_STATUS.OK)).toThrow(HttpStatusError)
		expect(() => assertStatus({ status: 500 }, HTTP_STATUS.OK)).toThrow("Expected status 200, got 500")
	})
})
