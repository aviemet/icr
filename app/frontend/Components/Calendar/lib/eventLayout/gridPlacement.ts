import { CalendarGenerics } from "@/Components/Calendar"

import { CalendarLocalizer } from "../localizers"

/**
 * Calculates the grid column placement for an event in a calendar view
 */
export const calculateGridPlacement = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	const start = event.start
	const end = localizer.adjustMidnightTime(event.end)

	const startDay = localizer.dayOfWeek(start)
	const endDay = localizer.dayOfWeek(end)

	const columnStart = startDay + 1
	const columnSpan = (endDay < startDay ? endDay + 7 : endDay) - startDay + 1

	return { columnStart, columnSpan }
}
