import { describe, it, expect, vi } from "vitest"

import { isUnset, getInputOnChange } from "@/lib/forms"

describe("isUnset", () => {
	it("returns true for null and undefined", () => {
		expect(isUnset(null)).toBe(true)
		expect(isUnset(undefined)).toBe(true)
	})

	it("returns true for empty string", () => {
		expect(isUnset("")).toBe(true)
	})

	it("returns false for non-empty string", () => {
		expect(isUnset("hello")).toBe(false)
	})

	it("returns true for NaN", () => {
		expect(isUnset(Number.NaN)).toBe(true)
	})

	it("returns true for empty object stringified as {}", () => {
		expect(isUnset({})).toBe(true)
	})

	it("returns false for object with keys", () => {
		expect(isUnset({ a: 1 })).toBe(false)
	})

	it("returns true for array of only empty/undefined", () => {
		expect(isUnset(["", undefined])).toBe(true)
	})

	it("returns false for array with at least one set value", () => {
		expect(isUnset(["", "x"])).toBe(false)
	})
})

describe("getInputOnChange", () => {
	it("calls setValue with value when given plain value", () => {
		const setValue = vi.fn()
		const handler = getInputOnChange(setValue)
		handler("new value")
		expect(setValue).toHaveBeenCalledWith("new value")
	})

	it("calls setValue with result of function when given function", () => {
		const setValue = vi.fn()
		const handler = getInputOnChange(setValue)
		handler((current: string) => `${current}-suffix`)
		expect(setValue).toHaveBeenCalledWith(expect.any(Function))
	})

	it("calls setValue with checkbox checked when given change event with checkbox", () => {
		const setValue = vi.fn()
		const handler = getInputOnChange(setValue)
		const input = document.createElement("input")
		input.type = "checkbox"
		input.checked = true
		handler({ nativeEvent: {}, currentTarget: input })
		expect(setValue).toHaveBeenCalledWith(true)
	})

	it("calls setValue with input value when given change event with text input", () => {
		const setValue = vi.fn()
		const handler = getInputOnChange(setValue)
		const input = document.createElement("input")
		input.type = "text"
		input.value = "typed"
		handler({ nativeEvent: {}, currentTarget: input })
		expect(setValue).toHaveBeenCalledWith("typed")
	})
})
