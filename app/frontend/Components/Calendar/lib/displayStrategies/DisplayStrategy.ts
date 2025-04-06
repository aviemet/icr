import { SortedArray } from "@/lib/Collections/SortedArray"

import { CalendarGenerics } from "../.."
import { VIEW_NAMES } from "../../Views"
import { CalendarLocalizer } from "../localizers"
import { DisplayStrategyFunction, EventDisplayDetails } from "./DisplayStrategyManager"

export class DisplayStrategy<T extends CalendarGenerics> {
	displayStrategy: DisplayStrategyFunction<T>

	constructor(displayStrategy: DisplayStrategyFunction<T>) {
		this.displayStrategy = displayStrategy
	}

	/**
	 * Filters events outside of view window.
	 * Groups events by start date into a Map.
	 * Breaks long events into multiples based on the display strategy.
	 */
	groupAndFilterEvents(
		events: T["Event"][],
		date: Date,
		view: VIEW_NAMES,
		localizer: CalendarLocalizer,
	) {
		const firstDay = localizer.firstVisibleDay(date, view)
		const lastDay = localizer.lastVisibleDay(date, view)

		const groupedEvents = new Map<string, SortedArray<EventDisplayDetails<T>>>()

		events.forEach(event => {
			// Ignore events outside visible range for current view
			if(!localizer.isAfter(event.end, firstDay) || !localizer.isBefore(event.start, lastDay)) return

			// Group events by start time
			this.displayStrategy(event, localizer).forEach(processedEvent => {
				const sortingKey = localizer.startOf(processedEvent.event.start, "day").toISOString()

				if(!groupedEvents.has(sortingKey)) {
					groupedEvents.set(sortingKey, new SortedArray(processedEvent.compare))
				}

				groupedEvents.get(sortingKey)!.push(processedEvent)
			})
		})

		return groupedEvents
	}
}
