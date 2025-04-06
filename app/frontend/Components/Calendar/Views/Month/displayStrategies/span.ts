import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import {
	DisplayStrategyFunction,
	EventDisplayDetails,
	EventDisplayProperties,
} from "@/Components/Calendar/lib/displayStrategies/DisplayStrategyManager"
import {
	calculateGridPlacement,
	spansWeekBorder,
	splitAtWeekBorders,
} from "@/Components/Calendar/lib/eventLayout"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { coerceArray } from "@/lib"


const compareSpan = <T extends CalendarGenerics>(
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
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
export const spanStrategy: DisplayStrategyFunction<CalendarGenerics> = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
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

		return {
			event: processedEvent,
			displayProperties,
			compare: compareSpan<T>,
		}
	})
}
