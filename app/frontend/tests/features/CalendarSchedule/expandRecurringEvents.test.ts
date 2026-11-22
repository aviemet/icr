import { describe, expect, it } from "vitest"

import { expandRecurringEvents, expansionWindow } from "@/features/CalendarSchedule"

function mapSimple({
	master,
	originalOccurrenceStart,
	displayStart,
	displayEnd,
	isRecurring,
}: {
	master: { id: string, name?: string | null }
	originalOccurrenceStart: Date
	displayStart: Date
	displayEnd: Date
	isRecurring: boolean
}) {
	return {
		id: `${master.id}:${originalOccurrenceStart.toISOString()}`,
		title: master.name ?? "",
		start: displayStart,
		end: displayEnd,
		resources: { recurrence: { isRecurring } },
	}
}

describe("expandRecurringEvents", () => {
	it("expands weekly patterns inside the visible window without inventing DB children", () => {
		const masters = [{
			id: "master-1",
			name: "Shift",
			starts_at: "2026-11-16T09:00:00.000Z",
			ends_at: "2026-11-16T17:00:00.000Z",
			all_day: false,
			recurring_patterns: [
				{ recurring_type: "weekly", offset: 1, day_of_week: 1, end_date: "2026-11-30" },
			],
			event_exceptions: [],
		}]

		const window = expansionWindow(new Date("2026-11-20T00:00:00.000Z"), "month")
		const events = expandRecurringEvents(masters, window.start, window.end, mapSimple)

		expect(events.length).toBeGreaterThan(1)
		expect(events.every(event => {
			const recurrence = event.resources?.recurrence
			return typeof recurrence === "object"
				&& recurrence !== null
				&& "isRecurring" in recurrence
				&& recurrence.isRecurring === true
		})).toBe(true)
	})

	it("expands daily patterns every N days", () => {
		const masters = [{
			id: "master-daily",
			name: "Daily",
			starts_at: "2026-11-16T09:00:00.000Z",
			ends_at: "2026-11-16T10:00:00.000Z",
			recurring_patterns: [
				{ recurring_type: "daily", offset: 2, max_occurrences: 4 },
			],
			event_exceptions: [],
		}]

		const start = new Date("2026-11-16T00:00:00.000Z")
		const end = new Date("2026-11-30T00:00:00.000Z")
		const events = expandRecurringEvents(masters, start, end, mapSimple)

		expect(events.map(event => event.start.toISOString())).toEqual([
			"2026-11-16T09:00:00.000Z",
			"2026-11-18T09:00:00.000Z",
			"2026-11-20T09:00:00.000Z",
			"2026-11-22T09:00:00.000Z",
		])
	})

	it("expands monthly day-of-month patterns", () => {
		const masterStart = new Date("2026-01-15T09:00:00.000Z")
		const masters = [{
			id: "master-monthly",
			name: "Monthly",
			starts_at: masterStart.toISOString(),
			ends_at: "2026-01-15T10:00:00.000Z",
			recurring_patterns: [
				{ recurring_type: "monthly", offset: 1, day_of_month: 15, max_occurrences: 3 },
			],
			event_exceptions: [],
		}]

		const start = new Date("2026-01-01T00:00:00.000Z")
		const end = new Date("2026-04-01T00:00:00.000Z")
		const events = expandRecurringEvents(masters, start, end, mapSimple)

		expect(events).toHaveLength(3)
		expect(events.map(event => event.start.getDate())).toEqual([15, 15, 15])
		expect(events.map(event => event.start.getMonth())).toEqual([0, 1, 2])
		expect(events.every(event => event.start.getHours() === masterStart.getHours())).toBe(true)
		expect(events.every(event => event.start.getMinutes() === masterStart.getMinutes())).toBe(true)
	})

	it("expands yearly patterns", () => {
		const masters = [{
			id: "master-yearly",
			name: "Yearly",
			starts_at: "2024-11-16T09:00:00.000Z",
			ends_at: "2024-11-16T10:00:00.000Z",
			recurring_patterns: [
				{ recurring_type: "yearly", offset: 1, month_of_year: 11, day_of_month: 16, max_occurrences: 3 },
			],
			event_exceptions: [],
		}]

		const start = new Date("2024-01-01T00:00:00.000Z")
		const end = new Date("2027-01-01T00:00:00.000Z")
		const events = expandRecurringEvents(masters, start, end, mapSimple)

		expect(events.map(event => event.start.toISOString())).toEqual([
			"2024-11-16T09:00:00.000Z",
			"2025-11-16T09:00:00.000Z",
			"2026-11-16T09:00:00.000Z",
		])
	})

	it("hides cancelled occurrences", () => {
		const masters = [{
			id: "master-1",
			name: "Shift",
			starts_at: "2026-11-16T17:00:00.000Z",
			ends_at: "2026-11-17T01:00:00.000Z",
			recurring_patterns: [
				{ recurring_type: "weekly", offset: 1, day_of_week: new Date("2026-11-16T17:00:00.000Z").getDay() },
			],
			event_exceptions: [
				{ cancelled: "2026-11-23T17:00:00.000Z" },
			],
		}]

		const start = new Date("2026-11-16T00:00:00.000Z")
		const end = new Date("2026-11-30T00:00:00.000Z")
		const events = expandRecurringEvents(masters, start, end, mapSimple)

		expect(events.some(event => event.start.toISOString() === "2026-11-23T17:00:00.000Z")).toBe(false)
	})
})
