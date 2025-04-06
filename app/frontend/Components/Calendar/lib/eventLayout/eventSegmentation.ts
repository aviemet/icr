import { CalendarGenerics } from "@/Components/Calendar"

import { CalendarLocalizer } from "../localizers"

/**
 * Checks if an event spans across a week boundary
 */
export const spansWeekBorder = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	return !localizer.dateWithinRange("week", event.end, event.start)
}

/**
 * Splits an event into multiple events at week boundaries
 */
export const splitAtWeekBorders = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	const events: T["Event"][] = []
	let currentStart = event.start
	let currentEnd = localizer.adjustMidnightTime(event.end)

	while(
		localizer.startOf(currentStart, "week").getTime() !==
		localizer.startOf(currentEnd, "week").getTime()
	) {
		// Find the end of the current week
		const weekEnd = localizer.endOf(currentStart, "week")

		// Add event segment for current week
		events.push({
			...event,
			start: currentStart,
			end: weekEnd,
		})

		// Move to start of next week
		currentStart = localizer.add(weekEnd, 1, "day")
		currentStart = localizer.startOf(currentStart, "day")
	}

	// Add final segment if there are remaining days
	if(localizer.isBefore(currentStart, currentEnd)) {
		events.push({
			...event,
			start: currentStart,
			end: currentEnd,
		})
	}

	return events
}

/**
 * Splits an event into multiple segments at day boundaries
 */
export const splitAtDayBoundaries = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	const events: { event: T["Event"], displayStart: Date, displayEnd: Date }[] = []
	let currentStart = event.start
	let currentEnd = localizer.adjustMidnightTime(event.end)

	while(localizer.startOf(currentStart, "day").getTime() !==
		   localizer.startOf(currentEnd, "day").getTime()) {
		// Find the end of the current day
		const dayEnd = localizer.endOf(currentStart, "day")

		// Add event segment for current day with display times
		events.push({
			event,
			displayStart: currentStart,
			displayEnd: dayEnd,
		})

		// Move to start of next day
		currentStart = localizer.add(dayEnd, 1, "day")
		currentStart = localizer.startOf(currentStart, "day")
	}

	// Add final segment if there are remaining hours in the last day
	if(localizer.isBefore(currentStart, currentEnd)) {
		events.push({
			event,
			displayStart: currentStart,
			displayEnd: currentEnd,
		})
	}

	return events
}
