import { CalendarGenerics } from "@/Components/Calendar"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { VIEW_NAMES } from "../../Views"
import { DisplayStrategyFunction, EventDisplayDetails } from "../displayStrategies/DisplayStrategyManager"
import { CalendarLocalizer } from "../localizers"

/**
 * Filters events outside of view window.
 * Groups events by start date into a Map.
 * Breaks long events into multiples based on the display strategy.
 */
export const groupedEventsForPeriod = <T extends CalendarGenerics>(
	events: T["Event"][],
	date: Date,
	view: VIEW_NAMES,
	localizer: CalendarLocalizer,
	strategy: DisplayStrategyFunction<T>
) => {
	const firstDay = localizer.firstVisibleDay(date, view)
	const lastDay = localizer.lastVisibleDay(date, view)

	const groupedEvents = new Map<string, SortedArray<EventDisplayDetails<T>>>()

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
