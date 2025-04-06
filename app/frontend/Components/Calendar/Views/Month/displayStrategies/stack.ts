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

const compareStack = <T extends CalendarGenerics>(
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => {
	// Stack strategy: longer events get higher priority
	const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
	if(spanDiff !== 0) return spanDiff

	return a.event.start.valueOf() - b.event.start.valueOf()
}

const shouldSpanDays = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
): boolean => {
	const startDay = localizer.startOf(event.start, "day")
	const endDay = localizer.startOf(event.end, "day")

	// Calculate the difference in days
	const daysDiff = Math.floor((endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000))

	// Only span if the event ends 2 or more days after it starts
	return daysDiff >= 2
}

const shouldSplitAtWeekBoundary = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
): boolean => {
	return spansWeekBorder(event, localizer) && shouldSpanDays(event, localizer)
}

export const stackStrategy: DisplayStrategyFunction<CalendarGenerics> = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	let processedEvents: (typeof event)[]

	if(shouldSplitAtWeekBoundary(event, localizer)) {
		processedEvents = splitAtWeekBorders(event, localizer)
	} else {
		processedEvents = coerceArray(event)
	}

	return processedEvents.map((processedEvent, index) => {
		const displayProperties = {
			displayStart: processedEvent.start,
			displayEnd: processedEvent.end,
			columnStart: 1,
			columnSpan: 1,
			className: "",
		} as const satisfies EventDisplayProperties

		if(shouldSpanDays(processedEvent, localizer)) {
			Object.assign(displayProperties, {
				...calculateGridPlacement(processedEvent, localizer),
				className: clsx("filled", {
					"continues-on": processedEvents.length > 1 && index !== processedEvents.length,
					"continued-from": processedEvents.length > 1 && index !== 0,
				}),
			})
		} else {
			Object.assign(displayProperties, {
				columnStart: calculateGridPlacement(processedEvent, localizer).columnStart,
				columnSpan: 1,
				className: clsx("indicator"),
			})
		}

		return {
			event: processedEvent,
			displayProperties,
			compare: compareStack<T>,
		}
	})
}
