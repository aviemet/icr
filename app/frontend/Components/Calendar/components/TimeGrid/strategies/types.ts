import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

export interface EventPosition {
	column: number
	startRow: number
	span: number
	width?: string
	left?: string
	zIndex?: number
}

export interface TimeGridDisplayStrategy {
	name: "stack" | "split"
	calculatePosition: (
		event: CalendarEvent,
		columnIndex: number,
		columnEvents: CalendarEvent[],
		localizer: CalendarLocalizer
	) => EventPosition
	getClassNames: () => string[]
}
