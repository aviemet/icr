import { CalendarEvent } from "@/Components/CalendarCustom"
import { CalendarLocalizer } from "@/Components/CalendarCustom/lib/localizers"
import { coerceArray } from "@/lib"

const spansWeekBorder = <TEvent extends CalendarEvent = CalendarEvent>(event: TEvent, localizer: CalendarLocalizer) => {
	return !localizer.dateWithinRange("week", event.end, event.start)
}

const splitAtWeekBorders = <TEvent extends CalendarEvent = CalendarEvent>(event: TEvent, localizer: CalendarLocalizer) => {
	const events: TEvent[] = []
	let currentStart = event.start
	let currentEnd = event.end

	while(localizer.startOf(currentStart, "week").getTime() !==
			 localizer.startOf(currentEnd, "week").getTime()) {
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

export interface EventDisplayProperties {
	columnStart: number
	columnSpan: number
}

export type DisplayStrategyFunction<TEvent extends CalendarEvent = CalendarEvent> = (
	event: TEvent,
	localizer: CalendarLocalizer
) => {
	event: TEvent
	displayProperties: EventDisplayProperties
}[]

export const strategies = {
	/**
	 * Stack strategy
	 * Events which continue on to the next day will not appear on
	 * the next day.
	 * Events which continue on for more than 1 day will span all
	 * days in which they occur within the same week.
	 * Events spanning multiple weeks will be split at week boundaries.
	 */
	stack: ((event, localizer) => {
		let processedEvents: (typeof event)[]

		if(spansWeekBorder(event, localizer)) {
			processedEvents = splitAtWeekBorders(event, localizer)
		}

		processedEvents = coerceArray(event)
		return processedEvents.map(processedEvent => {
			return {
				event: processedEvent,
				displayProperties: localizer.calculateGridPlacement(processedEvent),
			}
		})
	}) satisfies DisplayStrategyFunction,

	/**
	 * Span strategy
	 * Events will always span across days in which they appear.
	 */
	span: ((event, localizer) => {
		let processedEvents: (typeof event)[]

		if(spansWeekBorder(event, localizer)) {
			processedEvents = splitAtWeekBorders(event, localizer)
		}

		processedEvents = coerceArray(event)
		return processedEvents.map(processedEvent => {
			return {
				event: processedEvent,
				displayProperties: localizer.calculateGridPlacement(processedEvent),
			}
		})
	}) satisfies DisplayStrategyFunction,

	/**
	 * Split strategy
	 * Events which continue on to the next day will be split
	 * into multiple events, at midnight, appearing individually
	 * for each day in which they occur.
	 */
	split: ((event, localizer) => {
		let processedEvents: (typeof event)[]

		processedEvents = coerceArray(event)
		return processedEvents.map(processedEvent => {
			return {
				event: processedEvent,
				displayProperties: localizer.calculateGridPlacement(processedEvent),
			}
		})
	}) satisfies DisplayStrategyFunction,
} as const

export type DisplayStrategy = keyof typeof strategies

export function displayStrategies<TEvent extends CalendarEvent = CalendarEvent>(
	strategy: DisplayStrategy | DisplayStrategyFunction<TEvent>,
	event: TEvent,
	localizer: CalendarLocalizer
): ReturnType<DisplayStrategyFunction<TEvent>> {
	if(typeof strategy === "function") {
		return (strategy as unknown as DisplayStrategyFunction<TEvent>)(event, localizer)
	}

	return (strategies[strategy] as unknown as DisplayStrategyFunction<TEvent>)(event, localizer)
}
