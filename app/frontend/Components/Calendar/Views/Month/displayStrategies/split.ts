import clsx from "clsx"

import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import { calculateGridPlacement, DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties, spansWeekBorder, splitAtWeekBorders } from "."

const compareSplit = <TEvent extends CalendarEvent = CalendarEvent>(
	a: EventDisplayDetails<TEvent>,
	b: EventDisplayDetails<TEvent>
) => {
	// Split strategy: sort by start time since all events are single-day
	return a.event.start.valueOf() - b.event.start.valueOf()
}

const splitAtDayBoundaries = <TEvent extends CalendarEvent = CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
) => {
	const events: { event: TEvent, displayStart: Date, displayEnd: Date }[] = []
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

export const splitStrategy: DisplayStrategyFunction = <TEvent extends CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
) => {
	// First split at week boundaries if needed
	const weekEvents = spansWeekBorder(event, localizer)
		? splitAtWeekBorders(event, localizer)
		: [event]

	// Then split each week segment at day boundaries
	const processedEvents = weekEvents.flatMap(weekEvent => {
		const startDay = localizer.startOf(weekEvent.start, "day")
		const endDay = localizer.startOf(localizer.adjustMidnightTime(weekEvent.end), "day")
		const spansMultipleDays = startDay.getTime() !== endDay.getTime()

		if(spansMultipleDays) {
			return splitAtDayBoundaries(weekEvent, localizer)
		} else {
			return [{
				event: weekEvent,
				displayStart: weekEvent.start,
				displayEnd: weekEvent.end,
			}]
		}
	})

	return processedEvents.map((processed, index) => {
		const displayProperties: EventDisplayProperties = {
			columnStart: calculateGridPlacement({
				...processed.event,
				start: processed.displayStart,
				end: processed.displayEnd,
			}, localizer).columnStart,
			columnSpan: 1, // Always single column since we split at day boundaries
			displayStart: processed.displayStart,
			displayEnd: processed.displayEnd,
			className: clsx("filled", {
				"continues-on": processedEvents.length > 1 && index < processedEvents.length - 1,
				"continued-from": processedEvents.length > 1 && index !== 0,
			}),
		}

		if(index < processedEvents.length - 1) {
			displayProperties.continues = true
		}

		return {
			event: processed.event,
			displayProperties,
			compare: compareSplit<TEvent>,
		}
	})
}
