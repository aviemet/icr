import { describe, expect, it } from "vitest"

import { readServerTableFilters, writeServerTableFilters } from "@/components/Table/serverTableFilters"
import {
	applicantFiltersFromServerValues,
	applicantServerFilterFields,
} from "@/domains/Applicants/Table/applicantTableFilters"

describe("applicantServerFilterFields", () => {
	it("defaults statuses to applicant and offered", () => {
		const values = readServerTableFilters(new URLSearchParams(), applicantServerFilterFields)
		const filters = applicantFiltersFromServerValues(values)

		expect(filters.statuses).toEqual(["applicant", "offered"])
	})

	it("drops statuses outside the pipeline", () => {
		const params = new URLSearchParams("statuses[]=declined&statuses[]=employed&statuses[]=withdrawn")
		const filters = applicantFiltersFromServerValues(
			readServerTableFilters(params, applicantServerFilterFields),
		)

		expect(filters.statuses).toEqual(["declined", "withdrawn"])
	})

	it("omits statuses from the url when they match the default", () => {
		const url = new URL("http://example.test/employees/applicants?statuses[]=declined")

		writeServerTableFilters(url, applicantServerFilterFields, {
			first_name: "",
			last_name: "",
			job_title: "",
			job_titles: [],
			statuses: ["applicant", "offered"],
		})

		expect(url.searchParams.has("statuses[]")).toBe(false)
	})
})
