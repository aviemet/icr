import { describe, expect, it } from "vitest"

import { defaultNormalizeSubmitError } from "@/components/Form/customSubmit"

describe("components/Form/customSubmit", () => {
	it("reads nested response errors from an object", () => {
		expect(defaultNormalizeSubmitError({
			response: {
				data: {
					errors: {
						name: "can't be blank",
					},
				},
			},
		})).toEqual({ name: "can't be blank" })
	})

	it("reads top-level errors from an object", () => {
		expect(defaultNormalizeSubmitError({
			errors: {
				email: "is invalid",
			},
		})).toEqual({ email: "is invalid" })
	})

	it("returns an empty object for non-objects", () => {
		expect(defaultNormalizeSubmitError("nope")).toEqual({})
		expect(defaultNormalizeSubmitError(null)).toEqual({})
	})

	it("ignores non-string error values", () => {
		expect(defaultNormalizeSubmitError({
			errors: {
				email: ["is invalid"],
				name: "required",
			},
		})).toEqual({ name: "required" })
	})
})
