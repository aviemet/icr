import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { type CalendarEvent } from "@/Components/Calendar/types"

import * as classes from "../TimeGrid.css"
import { DayHeading, EventPosition, TimeGridDisplayStrategy } from "./types"

function calculatePosition(
	event: CalendarEvent,
	columnIndex: number,
	_columnEvents: CalendarEvent[],
	_localizer: CalendarLocalizer,
	_columnHeadings: DayHeading[]
): EventPosition {
	// Use display times if available, otherwise use actual times
	const eventStart = event.displayStart || event.start
	const eventEnd = event.displayEnd || event.end

	const startHour = eventStart.getHours()
	const startMinute = eventStart.getMinutes()
	// Each hour contributes 2 rows, starting at row 1 for midnight
	const startRow = (startHour * 2) + (startMinute >= 30 ? 2 : 1)

	const endHour = eventEnd.getHours()
	const endMinute = eventEnd.getMinutes()
	// For end time, we want to include the full slot
	const endRow = (endHour * 2) + (endMinute > 0 ? 2 : 1)

	// If end time is earlier than start time (crosses midnight), extend to end of day
	const span = endRow <= startRow ? (49 - startRow) : (endRow - startRow)

	return {
		column: columnIndex + 1, // 1-based for grid
		startRow,
		span,
		zIndex: startRow, // Earlier events appear on top
	}
}

export const stackStrategy: TimeGridDisplayStrategy = {
	name: "stack",
	calculatePosition,
	getClassNames: () => [classes.stackedEvent],
}
