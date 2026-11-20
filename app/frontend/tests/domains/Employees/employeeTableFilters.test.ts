import { describe, expect, it } from "vitest"

import { readServerTableFilters, writeServerTableFilters } from "@/components/Table/serverTableFilters"
import {
	employeeFiltersFromServerValues,
	employeeServerFilterFields,
	employeeServerFilterOnly,
} from "@/domains/Employees/Table/employeeTableFilters"

describe("employeeServerFilterFields", () => {
	it("leaves the statuses param to the scope menu", () => {
		expect(employeeServerFilterFields.some(field => field.param === "statuses")).toBe(false)
	})

	it("reloads the employee scope props with the table", () => {
		expect(employeeServerFilterOnly).toEqual(expect.arrayContaining([
			"can_scope_employees",
			"workforce_view",
		]))
	})

	it("reads column filters from the generic reader", () => {
		const url = new URL("http://example.test/employees?first_name=Ada&job_titles[]=Caregiver")
		const filters = employeeFiltersFromServerValues(
			readServerTableFilters(url.searchParams, employeeServerFilterFields),
		)

		expect(filters.firstName).toBe("Ada")
		expect(filters.jobTitles).toEqual(["Caregiver"])
		expect(filters.lastName).toBe("")
	})

	it("preserves the workforce_view param when column filters are written", () => {
		const url = new URL("http://example.test/employees?page=2&workforce_view=terminated")

		writeServerTableFilters(url, employeeServerFilterFields, {
			first_name: "Ada",
			last_name: "",
			job_title: "",
			job_titles: [],
			active_at: { start: "", end: "" },
			number: "",
		})

		expect(url.searchParams.get("page")).toBeNull()
		expect(url.searchParams.get("first_name")).toBe("Ada")
		expect(url.searchParams.get("workforce_view")).toBe("terminated")
	})
})
