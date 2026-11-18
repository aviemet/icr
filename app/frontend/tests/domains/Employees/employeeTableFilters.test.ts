import { describe, expect, it } from "vitest"

import { readServerTableFilters, writeServerTableFilters } from "@/components/Table/serverTableFilters"
import {
	employeeFiltersFromServerValues,
	employeeServerFilterFields,
} from "@/domains/Employees/Table/employeeTableFilters"

describe("employeeServerFilterFields", () => {
	it("defaults statuses to employed through the generic reader", () => {
		const values = readServerTableFilters(new URLSearchParams(), employeeServerFilterFields)
		const filters = employeeFiltersFromServerValues(values)

		expect(filters.statuses).toEqual(["employed"])
		expect(filters.firstName).toBe("")
	})

	it("round-trips empty statuses through the generic writer", () => {
		const url = new URL("http://example.test/employees?page=2")

		writeServerTableFilters(url, employeeServerFilterFields, {
			first_name: "",
			last_name: "",
			job_title: "",
			job_titles: [],
			statuses: [],
			active_at: "",
			number: "",
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("adv")).toBe("true")
		expect(url.searchParams.getAll("statuses[]")).toEqual([""])

		const filters = employeeFiltersFromServerValues(
			readServerTableFilters(url.searchParams, employeeServerFilterFields),
		)
		expect(filters.statuses).toEqual([])
	})
})
