import { describe, it, expect } from "vitest"

import {
	coerceArray,
	exclude,
	withDefaults,
	matchesAtPosition,
	hasUniqueValues,
	renameObjectWithAttributes,
} from "@/lib/collections"

describe("coerceArray", () => {
	it("returns empty array for null and undefined", () => {
		expect(coerceArray(null)).toEqual([])
		expect(coerceArray(undefined)).toEqual([])
	})

	it("returns array unchanged when given array", () => {
		expect(coerceArray([1, 2, 3])).toEqual([1, 2, 3])
	})

	it("wraps non-array in array", () => {
		expect(coerceArray(1)).toEqual([1])
		expect(coerceArray("a")).toEqual(["a"])
	})
})

describe("exclude", () => {
	it("omits single key from object", () => {
		const obj = { a: 1, b: 2, c: 3 }
		expect(exclude(obj, "b")).toEqual({ a: 1, c: 3 })
	})

	it("omits multiple keys when given array", () => {
		const obj = { a: 1, b: 2, c: 3 }
		expect(exclude(obj, ["a", "c"])).toEqual({ b: 2 })
	})

	it("does not mutate original object", () => {
		const obj = { a: 1, b: 2 }
		exclude(obj, "b")
		expect(obj).toEqual({ a: 1, b: 2 })
	})
})

describe("withDefaults", () => {
	it("merges obj over defaults", () => {
		const defaults = { a: 1, b: 2 }
		const obj = { b: 3 }
		expect(withDefaults(obj, defaults)).toEqual({ a: 1, b: 3 })
	})
})

describe("matchesAtPosition", () => {
	it("returns true when all position/value pairs match", () => {
		expect(matchesAtPosition(["a", "b", "c"], [0, "a"], [2, "c"])).toBe(true)
	})

	it("returns false when index out of range", () => {
		expect(matchesAtPosition(["a"], [1, "x"])).toBe(false)
	})

	it("returns false when value at position does not match", () => {
		expect(matchesAtPosition(["a", "b"], [1, "x"])).toBe(false)
	})

	it("returns false when given no args", () => {
		expect(matchesAtPosition(["a"])).toBe(false)
	})
})

describe("hasUniqueValues", () => {
	it("returns true when all values at key are unique", () => {
		expect(hasUniqueValues([{ id: 1 }, { id: 2 }], "id")).toBe(true)
	})

	it("returns false when duplicate value at key exists", () => {
		expect(hasUniqueValues([{ id: 1 }, { id: 1 }], "id")).toBe(false)
	})

	it("returns true for empty array", () => {
		expect(hasUniqueValues([], "id")).toBe(true)
	})
})

describe("renameObjectWithAttributes", () => {
	it("returns non-object unchanged", () => {
		expect(renameObjectWithAttributes(null)).toBe(null)
		expect(renameObjectWithAttributes("str")).toBe("str")
	})

	it("appends _attributes to keys whose values are objects or arrays", () => {
		const data = { foo: { bar: {} } }
		const result = renameObjectWithAttributes(data)
		expect(result).toEqual({ foo: { bar_attributes: {} } })
	})

	it("uses custom suffix when provided", () => {
		const data = { foo: { bar: [] } }
		expect(renameObjectWithAttributes(data, "_suffix")).toEqual({ foo: { bar_suffix: [] } })
	})
})
