import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { type CalendarEvent } from "@/Components/Calendar/types"

import * as classes from "../TimeGrid.css"
import { DayHeading, EventPosition, TimeGridDisplayStrategy } from "./types"

function findOverlappingEvents(event: CalendarEvent, columnEvents: CalendarEvent[]) {
	return [
		event,
		...columnEvents.filter(otherEvent => {
			if(otherEvent.id === event.id) return false

			const eventStart = event.displayStart?.getTime() || event.start.getTime()
			const eventEnd = event.displayEnd?.getTime() || event.end.getTime()
			const otherStart = otherEvent.displayStart?.getTime() || otherEvent.start.getTime()
			const otherEnd = otherEvent.displayEnd?.getTime() || otherEvent.end.getTime()

			return (eventStart < otherEnd && eventEnd > otherStart)
		}),
	].sort((a, b) => {
		const aStart = a.displayStart?.getTime() || a.start.getTime()
		const bStart = b.displayStart?.getTime() || b.start.getTime()
		return aStart - bStart
	})
}

function calculatePosition(
	event: CalendarEvent,
	columnIndex: number,
	columnEvents: CalendarEvent[],
	_localizer: CalendarLocalizer,
	_columnHeadings: DayHeading[]
): EventPosition {
	// Use display times if available, otherwise use actual times
	const eventStart = event.displayStart || event.start
	const eventEnd = event.displayEnd || event.end

	const startHour = eventStart.getHours()
	const startMinute = eventStart.getMinutes()
	const startRow = (startHour * 2) + (startMinute >= 30 ? 2 : 1)

	const endHour = eventEnd.getHours()
	const endMinute = eventEnd.getMinutes()
	const endRow = (endHour * 2) + (endMinute > 0 ? 2 : 1)

	// Calculate span for this segment
	const span = endRow <= startRow ? (49 - startRow) : (endRow - startRow)

	const overlappingEvents = findOverlappingEvents(event, columnEvents)
	const eventIndex = overlappingEvents.findIndex(e => e.id === event.id)

	return {
		column: columnIndex + 1,
		startRow,
		span,
		width: `${100 / overlappingEvents.length}%`,
		left: `${(eventIndex * 100) / overlappingEvents.length}%`,
	}
}

export const splitStrategy: TimeGridDisplayStrategy = {
	name: "split",
	calculatePosition,
	getClassNames: () => [classes.splitEvent],
}
