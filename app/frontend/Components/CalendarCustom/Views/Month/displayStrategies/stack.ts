import { CalendarEvent } from "@/Components/CalendarCustom"
import { CalendarLocalizer } from "@/Components/CalendarCustom/lib/localizers"
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

export const stackStrategy: DisplayStrategyFunction = <TEvent extends CalendarEvent>(event: TEvent, localizer: CalendarLocalizer) => {
	let processedEvents: (typeof event)[]

	if(spansWeekBorder(event, localizer)) {
		processedEvents = splitAtWeekBorders(event, localizer)
	}

	processedEvents = coerceArray(event)
	return processedEvents.map((processedEvent, index) => {
		const displayProperties: EventDisplayProperties = localizer.calculateGridPlacement(processedEvent)

		if(index < processedEvents.length) {
			displayProperties.continues = true
		}

		return {
			event: processedEvent,
			displayProperties,
			compare: compareStack<TEvent>,
		}
	})
}
