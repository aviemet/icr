import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import * as classes from "../TimeGrid.css"
import { EventPosition, TimeGridDisplayStrategy } from "./types"

function findOverlappingEvents(event: CalendarEvent, columnEvents: CalendarEvent[]) {
	return [
		event,
		...columnEvents.filter(otherEvent => {
			if(otherEvent.id === event.id) return false

			const eventStart = event.start.getTime()
			const eventEnd = event.end.getTime()
			const otherStart = otherEvent.start.getTime()
			const otherEnd = otherEvent.end.getTime()

			return (eventStart < otherEnd && eventEnd > otherStart)
		}),
	].sort((a, b) => a.start.getTime() - b.start.getTime())
}

function calculatePosition(
	event: CalendarEvent,
	columnIndex: number,
	columnEvents: CalendarEvent[],
	_localizer: CalendarLocalizer
): EventPosition {
	// Convert time to grid rows (48 rows total, 2 per hour)
	// Each hour takes 2 rows (one for :00, one for :30)
	// Grid is 1-based, so:
	// 12:00 AM = rows 1-2
	// 12:30 AM = rows 2-3
	// 1:00 AM = rows 3-4
	// ...
	// 12:00 PM = rows 25-26
	// ...
	// 11:30 PM = rows 47-48
	const startHour = event.start.getHours()
	const startMinute = event.start.getMinutes()
	// Each hour contributes 2 rows, starting at row 1 for midnight
	const startRow = (startHour * 2) + (startMinute >= 30 ? 2 : 1)

	const endHour = event.end.getHours()
	const endMinute = event.end.getMinutes()
	// For end time, we want to include the full slot
	const endRow = (endHour * 2) + (endMinute > 0 ? 2 : 1)

	// If end time is earlier than start time (crosses midnight), extend to end of day
	const span = endRow <= startRow ? (49 - startRow) : (endRow - startRow)

	const overlappingEvents = findOverlappingEvents(event, columnEvents)
	const eventIndex = overlappingEvents.findIndex(e => e.id === event.id)

	return {
		column: columnIndex + 1, // 1-based for grid
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
