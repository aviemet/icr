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
	{ param: "active_at", kind: "date_range" },
]

describe("readServerTableFilters", () => {
	it("applies multi defaults when the param is absent", () => {
		const values = readServerTableFilters(new URLSearchParams(), fields)

		expect(values).toEqual({
			first_name: "",
			job_titles: [],
			statuses: ["employed"],
			active_at: { start: "", end: "" },
		})
	})

	it("reads empty multi values when the key is present", () => {
		const params = new URLSearchParams()
		params.append("statuses[]", "")

		const values = readServerTableFilters(params, fields)

		expect(values.statuses).toEqual([])
	})

	it("reads text, multi, and date range params", () => {
		const params = new URLSearchParams()
		params.set("first_name", "Ada")
		params.append("job_titles[]", "Attendant")
		params.append("statuses[]", "applicant")
		params.append("statuses[]", "employed")
		params.set("active_at[start]", "2024-01-01")
		params.set("active_at[end]", "2024-06-30")
		params.set("active_at[type]", "range")

		const values = readServerTableFilters(params, fields)

		expect(values).toEqual({
			first_name: "Ada",
			job_titles: ["Attendant"],
			statuses: ["applicant", "employed"],
			active_at: { start: "2024-01-01", end: "2024-06-30" },
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
			active_at: { start: "", end: "" },
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
			active_at: { start: "", end: "" },
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.getAll("statuses[]")).toEqual([""])
	})

	it("writes text, multi, and date range params and clears page", () => {
		const url = new URL("http://example.test/items?page=4&sort=number")

		writeServerTableFilters(url, fields, {
			first_name: "Grace",
			job_titles: ["Manager"],
			statuses: ["applicant", "offered"],
			active_at: { start: "2024-02-01", end: "2024-02-29" },
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.get("first_name")).toBe("Grace")
		expect(url.searchParams.getAll("job_titles[]")).toEqual(["Manager"])
		expect(url.searchParams.getAll("statuses[]")).toEqual(["applicant", "offered"])
		expect(url.searchParams.get("active_at[start]")).toBe("2024-02-01")
		expect(url.searchParams.get("active_at[end]")).toBe("2024-02-29")
		expect(url.searchParams.get("active_at[type]")).toBe("range")
		expect(url.searchParams.get("sort")).toBe("number")
	})

	it("omits multi default values when other filters are active", () => {
		const url = new URL("http://example.test/items")

		writeServerTableFilters(url, fields, {
			first_name: "Ada",
			job_titles: [],
			statuses: ["employed"],
			active_at: { start: "", end: "" },
		})

		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.get("first_name")).toBe("Ada")
		expect(url.searchParams.has("statuses")).toBe(false)
		expect(url.searchParams.has("statuses[]")).toBe(false)
	})

	it("omits incomplete date ranges", () => {
		const url = new URL("http://example.test/items")

		writeServerTableFilters(url, fields, {
			first_name: "",
			job_titles: [],
			statuses: ["employed"],
			active_at: { start: "2024-01-01", end: "" },
		})

		expect(url.searchParams.get("adv")).toBeNull()
		expect(url.searchParams.get("active_at[start]")).toBeNull()
		expect(url.searchParams.get("active_at[end]")).toBeNull()
	})
})
