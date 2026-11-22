import { describe, expect, it } from "vitest"

import { recurrenceResources } from "@/features/CalendarSchedule"

describe("recurrenceResources", () => {
	it("maps expanded schedule payload fields into calendar recurrence resources", () => {
		const resources = recurrenceResources({
			id: "master-1__2026-11-23T17:00:00.000Z",
			master_id: "master-1",
			occurrence_starts_at: "2026-11-23T17:00:00.000Z",
			starts_at: "2026-11-23T17:00:00.000Z",
			is_recurring: true,
			recurring_patterns: [{ recurring_type: "weekly", offset: 1, day_of_week: 1 }],
		})

		expect(resources).toEqual({
			masterId: "master-1",
			occurrenceStartsAt: "2026-11-23T17:00:00.000Z",
			isRecurring: true,
			patterns: [{ recurring_type: "weekly", offset: 1, day_of_week: 1 }],
		})
	})

	it("falls back to id and starts_at for non-expanded rows", () => {
		const resources = recurrenceResources({
			id: "event-1",
			starts_at: "2026-11-18T09:00:00.000Z",
			is_recurring: false,
		})

		expect(resources.masterId).toBe("event-1")
		expect(resources.occurrenceStartsAt).toBe("2026-11-18T09:00:00.000Z")
		expect(resources.isRecurring).toBe(false)
		expect(resources.patterns).toEqual([])
	})
})
