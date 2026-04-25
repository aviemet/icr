import { describe, expect, it } from "vitest"

import { assignEventOverlaps } from "@/components/Calendar/lib/assignEventOverlaps"
import { EventDisplayDetails, TimeGridDisplayProperties } from "@/components/Calendar/lib/displayStrategies"
import { SortedArray } from "@/lib/Collections/SortedArray"

function buildColumnEvents(
	events: Array<{ start: Date, end: Date }>
) {
	const compare = (
		a: EventDisplayDetails<never, TimeGridDisplayProperties>,
		b: EventDisplayDetails<never, TimeGridDisplayProperties>
	) => {
		const startDifference = a.displayProperties.displayStart.getTime() - b.displayProperties.displayStart.getTime()
		if(startDifference !== 0) return startDifference

		return a.displayProperties.displayEnd.getTime() - b.displayProperties.displayEnd.getTime()
	}

	const columnEvents = new SortedArray<EventDisplayDetails<never, TimeGridDisplayProperties>>(compare)

	events.forEach((event, eventIndex) => {
		const displayProperties: TimeGridDisplayProperties = {
			displayStart: event.start,
			displayEnd: event.end,
			columnStart: 1,
			columnSpan: 1,
			rowStart: 1,
			rowEnd: 2,
		}

		const displayDetails: EventDisplayDetails<never, TimeGridDisplayProperties> = {
			event: {
				id: String(eventIndex),
				title: `Event ${eventIndex}`,
				start: event.start,
				end: event.end,
			},
			displayProperties,
			compare,
		}

		columnEvents.push(displayDetails)
	})

	return columnEvents
}

describe("assignEventOverlaps", () => {
	it("returns groupSize 1 for non-overlapping events", () => {
		const nineAM = new Date("2026-01-01T09:00:00.000Z")
		const tenAM = new Date("2026-01-01T10:00:00.000Z")
		const elevenAM = new Date("2026-01-01T11:00:00.000Z")
		const noon = new Date("2026-01-01T12:00:00.000Z")

		const columnEvents = buildColumnEvents([
			{ start: nineAM, end: tenAM },
			{ start: elevenAM, end: noon },
		])

		const overlapData = assignEventOverlaps(columnEvents)

		expect(overlapData.get(0)).toEqual({ slotIndex: 0, groupSize: 1 })
		expect(overlapData.get(1)).toEqual({ slotIndex: 0, groupSize: 1 })
	})

	it("assigns two columns for overlapping events", () => {
		const nineAM = new Date("2026-01-01T09:00:00.000Z")
		const tenAM = new Date("2026-01-01T10:00:00.000Z")
		const elevenAM = new Date("2026-01-01T11:00:00.000Z")

		const columnEvents = buildColumnEvents([
			{ start: nineAM, end: elevenAM },
			{ start: tenAM, end: elevenAM },
		])

		const overlapData = assignEventOverlaps(columnEvents)

		expect(overlapData.get(0)?.groupSize).toBe(2)
		expect(overlapData.get(1)?.groupSize).toBe(2)
		expect(new Set([overlapData.get(0)?.slotIndex, overlapData.get(1)?.slotIndex])).toEqual(new Set([0, 1]))
	})

	it("reuses columns for chain overlaps where endpoints touch", () => {
		const nineAM = new Date("2026-01-01T09:00:00.000Z")
		const tenAM = new Date("2026-01-01T10:00:00.000Z")
		const elevenAM = new Date("2026-01-01T11:00:00.000Z")
		const noon = new Date("2026-01-01T12:00:00.000Z")
		const onePM = new Date("2026-01-01T13:00:00.000Z")

		const columnEvents = buildColumnEvents([
			{ start: nineAM, end: elevenAM },
			{ start: tenAM, end: noon },
			{ start: elevenAM, end: onePM },
		])

		const overlapData = assignEventOverlaps(columnEvents)

		expect(overlapData.get(0)).toEqual({ slotIndex: 0, groupSize: 2 })
		expect(overlapData.get(1)).toEqual({ slotIndex: 1, groupSize: 2 })
		expect(overlapData.get(2)).toEqual({ slotIndex: 0, groupSize: 2 })
	})

	it("uses three columns when three events overlap concurrently", () => {
		const nineAM = new Date("2026-01-01T09:00:00.000Z")
		const nineThirtyAM = new Date("2026-01-01T09:30:00.000Z")
		const tenAM = new Date("2026-01-01T10:00:00.000Z")
		const elevenAM = new Date("2026-01-01T11:00:00.000Z")

		const columnEvents = buildColumnEvents([
			{ start: nineAM, end: elevenAM },
			{ start: nineThirtyAM, end: elevenAM },
			{ start: tenAM, end: elevenAM },
		])

		const overlapData = assignEventOverlaps(columnEvents)

		expect(overlapData.get(0)?.groupSize).toBe(3)
		expect(overlapData.get(1)?.groupSize).toBe(3)
		expect(overlapData.get(2)?.groupSize).toBe(3)
		expect(new Set([overlapData.get(0)?.slotIndex, overlapData.get(1)?.slotIndex, overlapData.get(2)?.slotIndex]))
			.toEqual(new Set([0, 1, 2]))
	})
})

