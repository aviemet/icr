import { CalendarGenerics } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

export interface DayHeading {
	date: Date
	label: string
}

export interface EventPosition {
	column: number
	startRow: number
	span: number
	width?: string
	left?: string
	zIndex?: number
}

export interface TimeGridDisplayStrategy<T extends CalendarGenerics = CalendarGenerics> {
	name: "stack" | "split"
	calculatePosition: (
		event: T["Event"],
		columnIndex: number,
		columnEvents: T["Event"][],
		localizer: CalendarLocalizer,
		columnHeadings: DayHeading[]
	) => EventPosition
	getClassNames: () => string[]
}
