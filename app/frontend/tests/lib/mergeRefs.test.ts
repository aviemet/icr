import { describe, it, expect, vi } from "vitest"

import { mergeRefs } from "@/lib/mergeRefs"

describe("mergeRefs", () => {
	it("returns a callback function", () => {
		const result = mergeRefs([])
		expect(typeof result).toBe("function")
	})

	it("assigns value to ref.current when ref object is provided", () => {
		const ref = { current: null as HTMLDivElement | null }
		const callback = mergeRefs([ref])
		const el = document.createElement("div")
		callback(el)
		expect(ref.current).toBe(el)
	})

	it("calls ref when ref is a function", () => {
		const refFn = vi.fn()
		const callback = mergeRefs([refFn])
		const el = document.createElement("div")
		callback(el)
		expect(refFn).toHaveBeenCalledWith(el)
	})

	it("ignores null refs", () => {
		const ref = { current: null as HTMLDivElement | null }
		const callback = mergeRefs([null, ref])
		const el = document.createElement("div")
		expect(() => callback(el)).not.toThrow()
		expect(ref.current).toBe(el)
	})

	it("updates all refs with same value", () => {
		const ref1 = { current: null as HTMLDivElement | null }
		const ref2 = { current: null as HTMLDivElement | null }
		const callback = mergeRefs([ref1, ref2])
		const el = document.createElement("div")
		callback(el)
		expect(ref1.current).toBe(el)
		expect(ref2.current).toBe(el)
	})
})
