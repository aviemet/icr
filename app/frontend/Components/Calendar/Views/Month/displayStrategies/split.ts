import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { coerceArray } from "@/lib"

import { DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties, spansWeekBorder, splitAtWeekBorders } from "."

const compareSplit = <TEvent extends CalendarEvent = CalendarEvent>(
	a: EventDisplayDetails<TEvent>,
	b: EventDisplayDetails<TEvent>
) => {
	// Split strategy: longer events get higher priority
	const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
	if(spanDiff !== 0) return spanDiff

	return a.event.start.valueOf() - b.event.start.valueOf()
}

export const splitStrategy: DisplayStrategyFunction = <TEvent extends CalendarEvent>(event: TEvent, localizer: CalendarLocalizer) => {
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
			compare: compareSplit<TEvent>,
		}
	})
}
