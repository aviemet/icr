import { coerceArray } from "@/lib"

import { DisplayStrategyFunction, EventDisplayProperties, spansWeekBorder, splitAtWeekBorders } from "."

export const spanStrategy: DisplayStrategyFunction = (event, localizer) => {
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
		}
	})
}
