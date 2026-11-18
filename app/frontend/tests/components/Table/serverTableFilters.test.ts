import { describe, expect, it } from "vitest"

import {
	readServerTableFilters,
	writeServerTableFilters,
	type ServerTableFilterField,
} from "@/components/Table/serverTableFilters"

const fields: ServerTableFilterField[] = [
	{ param: "first_name", kind: "text" },
	{ param: "job_titles", kind: "multi" },
	{ param: "statuses", kind: "multi", default: ["employed"] },
]

describe("readServerTableFilters", () => {
	it("applies multi defaults when the param is absent", () => {
		const values = readServerTableFilters(new URLSearchParams(), fields)

		expect(values).toEqual({
			first_name: "",
			job_titles: [],
			statuses: ["employed"],
		})
	})

	it("reads empty multi values when the key is present", () => {
		const params = new URLSearchParams()
		params.append("statuses[]", "")

		const values = readServerTableFilters(params, fields)

		expect(values.statuses).toEqual([])
	})

	it("reads text and multi params", () => {
		const params = new URLSearchParams()
		params.set("first_name", "Ada")
		params.append("job_titles[]", "Attendant")
		params.append("statuses[]", "applicant")
		params.append("statuses[]", "employed")

		const values = readServerTableFilters(params, fields)

		expect(values).toEqual({
			first_name: "Ada",
			job_titles: ["Attendant"],
			statuses: ["applicant", "employed"],
		})
	})
})

describe("writeServerTableFilters", () => {
	it("omits filter params for the default state", () => {
		const url = new URL("http://example.test/items?page=2&search=ada")

		writeServerTableFilters(url, fields, {
			first_name: "",
			job_titles: [],
			statuses: ["employed"],
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("adv")).toBeNull()
		expect(url.searchParams.has("statuses")).toBe(false)
		expect(url.searchParams.has("statuses[]")).toBe(false)
		expect(url.searchParams.get("search")).toBe("ada")
	})

	it("encodes empty multi defaults so the server sees the key", () => {
		const url = new URL("http://example.test/items?page=3")

		writeServerTableFilters(url, fields, {
			first_name: "",
			job_titles: [],
			statuses: [],
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.getAll("statuses[]")).toEqual([""])
	})

	it("writes text and multi params and clears page", () => {
		const url = new URL("http://example.test/items?page=4&sort=number")

		writeServerTableFilters(url, fields, {
			first_name: "Grace",
			job_titles: ["Manager"],
			statuses: ["applicant", "offered"],
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.get("first_name")).toBe("Grace")
		expect(url.searchParams.getAll("job_titles[]")).toEqual(["Manager"])
		expect(url.searchParams.getAll("statuses[]")).toEqual(["applicant", "offered"])
		expect(url.searchParams.get("sort")).toBe("number")
	})

	it("omits multi default values when other filters are active", () => {
		const url = new URL("http://example.test/items")

		writeServerTableFilters(url, fields, {
			first_name: "Ada",
			job_titles: [],
			statuses: ["employed"],
		})

		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.get("first_name")).toBe("Ada")
		expect(url.searchParams.has("statuses")).toBe(false)
		expect(url.searchParams.has("statuses[]")).toBe(false)
	})
})
