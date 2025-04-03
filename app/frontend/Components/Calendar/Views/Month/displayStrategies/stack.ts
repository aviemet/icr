import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { coerceArray } from "@/lib"

import { DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties, spansWeekBorder, splitAtWeekBorders } from "."

const compareStack = <TEvent extends CalendarEvent = CalendarEvent>(
	a: EventDisplayDetails<TEvent>,
	b: EventDisplayDetails<TEvent>
) => {
	// Stack strategy: longer events get higher priority
	const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
	if(spanDiff !== 0) return spanDiff

	return a.event.start.valueOf() - b.event.start.valueOf()
}

const shouldSpanDays = <TEvent extends CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
): boolean => {
	const startDay = localizer.startOf(event.start, "day")
	const endDay = localizer.startOf(event.end, "day")

	// Calculate the difference in days
	const daysDiff = Math.floor((endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000))

	// Only span if the event ends 2 or more days after it starts
	return daysDiff >= 2
}

const shouldSplitAtWeekBoundary = <TEvent extends CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
): boolean => {
	return spansWeekBorder(event, localizer) && shouldSpanDays(event, localizer)
}

export const stackStrategy: DisplayStrategyFunction = <TEvent extends CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
) => {
	let processedEvents: (typeof event)[]

	if(shouldSplitAtWeekBoundary(event, localizer)) {
		processedEvents = splitAtWeekBorders(event, localizer)
	} else {
		processedEvents = coerceArray(event)
	}

	return processedEvents.map((processedEvent, index) => {
		let displayProperties: EventDisplayProperties

		if(shouldSpanDays(processedEvent, localizer)) {
			// For events that span 2+ days, show the full span
			displayProperties = localizer.calculateGridPlacement(processedEvent)
		} else {
			// For events that end the next day, only show on the start day
			displayProperties = {
				columnStart: localizer.calculateGridPlacement(processedEvent).columnStart,
				columnSpan: 1,
			}
		}

		if(index < processedEvents.length - 1) {
			displayProperties.continues = true
		}

		return {
			event: processedEvent,
			displayProperties,
			compare: compareStack<TEvent>,
		}
	})
}
