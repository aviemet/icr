import { CalendarEvent } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import { VIEW_NAMES } from "@/Components/Calendar/Views"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { spanStrategy } from "./span"
import { splitStrategy } from "./split"
import { stackStrategy } from "./stack"

export interface EventDisplayProperties {
	displayStart: Date
	displayEnd: Date
	columnStart: number
	columnSpan: number
	continues?: true
	className?: string
}

export type CompareFunction<TEvent extends CalendarEvent = CalendarEvent> = (
	a: EventDisplayDetails<TEvent>,
	b: EventDisplayDetails<TEvent>
) => number

export interface EventDisplayDetails<TEvent extends CalendarEvent = CalendarEvent> {
	event: TEvent
	displayProperties: EventDisplayProperties
	compare: CompareFunction<TEvent>
}

export type DisplayStrategyFunction<TEvent extends CalendarEvent = CalendarEvent> = (
	event: TEvent,
	localizer: CalendarLocalizer
) => EventDisplayDetails<TEvent>[]

const strategies = {
	/**
	 * Stack strategy
	 * Events which continue on to the next day will not appear on
	 * the next day.
	 * Events which continue on for more than 1 day will span all
	 * days in which they occur within the same week.
	 * Events spanning multiple weeks will be split at week boundaries.
	 */
	stack: stackStrategy,

	/**
	 * Span strategy
	 * Events will always span across days in which they appear.
	 */
	span: spanStrategy,

	/**
	 * Split strategy
	 * Events which continue on to the next day will be split
	 * into multiple events, at midnight, appearing individually
	 * for each day in which they occur.
	 */
	split: splitStrategy,
} as const
export type DisplayStrategy = keyof typeof strategies

/**
 * Accepts the key of a standard strategy, or a custom strategy as a function
 * Returns the result of that strategy being called with an event and localizer
 *
 * @param strategy "stack" | "span" | "split" | DisplayStrategyFunction
 * @param event CalendarEvent
 * @param localizer CalendarLocalizer
 * @returns DisplayStrategyFunction
 */
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

/*******************************************
 * Helper functions for display strategies *
 *******************************************/

/**
 * Filters events outside of view window.
 * Groups events by start date into a Map.
 * Breaks long events into multiples based on the display strategy.
 */
export const groupedEventsForPeriod = <TEvent extends CalendarEvent = CalendarEvent>(
	events: TEvent[],
	date: Date,
	view: VIEW_NAMES,
	localizer: CalendarLocalizer,
	displayStrategy: DisplayStrategy | DisplayStrategyFunction<TEvent> = "stack",
) => {
	const firstDay = localizer.firstVisibleDay(date, view)
	const lastDay = localizer.lastVisibleDay(date, view)
	const strategy = typeof displayStrategy === "string"
		? (strategies[displayStrategy] as unknown as DisplayStrategyFunction<TEvent>)
		: displayStrategy

	const groupedEvents = new Map<string, SortedArray<EventDisplayDetails<TEvent>>>()

	events.forEach(event => {
		// Ignore events outside visible range for current view
		if(!localizer.isAfter(event.end, firstDay) || !localizer.isBefore(event.start, lastDay)) return

		// Group events by start time
		strategy(event, localizer).forEach(processedEvent => {
			const sortingKey = localizer.startOf(processedEvent.event.start, "day").toISOString()

			if(!groupedEvents.has(sortingKey)) {
				groupedEvents.set(sortingKey, new SortedArray(processedEvent.compare))
			}

			groupedEvents.get(sortingKey)!.push(processedEvent)
		})
	})

	return groupedEvents
}

/**
 *
 */
export const calculateGridPlacement = <TEvent extends CalendarEvent = CalendarEvent>(event: TEvent, localizer: CalendarLocalizer) => {
	const start = event.start
	const end = localizer.adjustMidnightTime(event.end)

	const startDay = localizer.dayOfWeek(start)
	const endDay = localizer.dayOfWeek(end)

	const columnStart = startDay + 1
	const columnSpan = (endDay < startDay ? endDay + 7 : endDay) - startDay + 1

	return { columnStart, columnSpan }
}

/**
 *
 */
export const spansWeekBorder = <TEvent extends CalendarEvent = CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
) => {
	return !localizer.dateWithinRange("week", event.end, event.start)
}

/**
 *
 */
export const splitAtWeekBorders = <TEvent extends CalendarEvent = CalendarEvent>(
	event: TEvent,
	localizer: CalendarLocalizer
) => {
	const events: TEvent[] = []
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
