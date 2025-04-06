import { SortedArray } from "@/lib/Collections/SortedArray"

import { CalendarGenerics } from "../.."
import { DisplayStrategyFunction, EventDisplayDetails } from "./types"
import { VIEW_NAMES } from "../../Views"
import { agendaDisplayStrategies } from "../../Views/Agenda/displayStrategies"
import { dayDisplayStrategies } from "../../Views/Day/displayStrategies"
import { monthDisplayStrategies } from "../../Views/Month/displayStrategies"
import { weekDisplayStrategies } from "../../Views/Week/displayStrategies"
import { CalendarLocalizer } from "../localizers"

export * from "./types"

export const displayStrategies = {
	month: monthDisplayStrategies,
	week: weekDisplayStrategies,
	day: dayDisplayStrategies,
	agenda: agendaDisplayStrategies,
} as const

export type DisplayStrategies = typeof displayStrategies
export type ViewStrategyType<V extends VIEW_NAMES> = keyof DisplayStrategies[V]

/**
 *
 */
export const groupAndFilterEvents = <T extends CalendarGenerics>(
	view: VIEW_NAMES,
	strategy: DisplayStrategyFunction<T>,
	events: T["Event"][],
	date: Date,
	localizer: CalendarLocalizer
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
