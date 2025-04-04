import clsx from "clsx"

import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { coerceArray } from "@/lib"

import { calculateGridPlacement, DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties, spansWeekBorder, splitAtWeekBorders } from "."

const compareSpan = <TEvent extends CalendarEvent>(
	a: EventDisplayDetails<TEvent>,
	b: EventDisplayDetails<TEvent>
) => {
	// Span strategy: longer events get higher priority
	const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
	if(spanDiff !== 0) return spanDiff

	return a.event.start.valueOf() - b.event.start.valueOf()
}

/**
 * Span strategy
 * Events will always span across days in which they appear.
 */
export const spanStrategy: DisplayStrategyFunction = <TEvent extends CalendarEvent>(event: TEvent, localizer: CalendarLocalizer) => {
	let processedEvents: (typeof event)[]

	if(spansWeekBorder(event, localizer)) {
		processedEvents = splitAtWeekBorders(event, localizer)
	} else {
		processedEvents = coerceArray(event)
	}

	return processedEvents.map((processedEvent, index) => {
		const doesSpan = !localizer.isSame(processedEvent.start, processedEvent.end, "day")

		const displayProperties: EventDisplayProperties = {
			...calculateGridPlacement(processedEvent, localizer),
			displayStart: processedEvent.start,
			displayEnd: processedEvent.end,
			className: clsx(doesSpan ? "filled" : "indicator", {
				"continues-on": processedEvents.length > 1 && index !== processedEvents.length,
				"continued-from": processedEvents.length > 1 && index !== 0,
			}),
		}

		if(index < processedEvents.length) {
			displayProperties.continues = true
		}

		return {
			event: processedEvent,
			displayProperties,
			compare: compareSpan<TEvent>,
		}
	})
}
