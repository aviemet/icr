import { Resources, CalendarEvent } from "@/Components/Calendar"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { VIEW_NAMES } from "../../Views"
import { EventDisplayDetails, BaseDisplayStrategy, BaseDisplayProperties } from "../displayStrategies"
import { CalendarLocalizer } from "../localizers"


/**
 * Filters events outside of view window.
 * Groups events by start date into a Map.
 * Breaks long events into multiples based on the display strategy.
 */
export const groupedEventsForPeriod = <
	TResources extends Resources,
	P extends BaseDisplayProperties
>(
	events: CalendarEvent<TResources>[],
	date: Date,
	view: VIEW_NAMES,
	localizer: CalendarLocalizer,
	strategy: BaseDisplayStrategy<TResources, P>
): Map<string, SortedArray<EventDisplayDetails<TResources, P>>> => {
	const firstDay = localizer.firstVisibleDay(date, view)
	const lastDay = localizer.lastVisibleDay(date, view)

	const groupedEvents = new Map<string, SortedArray<EventDisplayDetails<TResources, P>>>()

	events.forEach(event => {
		// Ignore events outside visible range for current view
		if(!localizer.isAfter(event.end, firstDay) || !localizer.isBefore(event.start, lastDay)) return

		// Use strategy instance method
		strategy.processEvent(event).forEach(processedEvent => {
			const sortingKey = localizer.startOf(processedEvent.event.start, "day").toISOString()

			if(!groupedEvents.has(sortingKey)) {
				// Use compare method from strategy instance
				groupedEvents.set(sortingKey, new SortedArray(strategy.compare.bind(strategy)))
			}

			groupedEvents.get(sortingKey)!.push(processedEvent)
		})
	})

	return groupedEvents
}
