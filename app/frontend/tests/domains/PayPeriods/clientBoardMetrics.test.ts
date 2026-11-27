import { describe, expect, it } from "vitest"

import {
	countClientsWithPending,
	countFullyReviewedClients,
	sumAuthorizedHours,
	sumRecordValues,
} from "@/domains/PayPeriods/clientBoardMetrics"

describe("clientBoardMetrics", () => {
	it("sums record values", () => {
		expect(sumRecordValues({ a: 1.5, b: 2.5 })).toBe(4)
	})

	it("counts clients with pending shifts", () => {
		const clients = [{ id: "1" }, { id: "2" }, { id: "3" }]

		expect(countClientsWithPending(clients, { "1": 2, "2": 0, "3": 4 })).toBe(2)
	})

	it("counts fully reviewed clients with shift activity", () => {
		const clients = [{ id: "1" }, { id: "2" }, { id: "3" }]

		expect(countFullyReviewedClients(
			clients,
			{ "1": 0, "2": 3, "3": 0 },
			{ "1": 5, "2": 3, "3": 0 },
		)).toBe(1)
	})

	it("sums authorized hours from clients", () => {
		expect(sumAuthorizedHours([
			{ ihss_authorized_hours: 40 },
			{ ihss_authorized_hours: "12.5" },
			{ ihss_authorized_hours: null },
		])).toBe(52.5)
	})
})
