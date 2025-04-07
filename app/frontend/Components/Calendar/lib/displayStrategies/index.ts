import { SortedArray } from "@/lib/Collections/SortedArray"

import { CalendarGenerics } from "../.."
import { BaseDisplayStrategy, StrategyConfig } from "./BaseDisplayStrategy"
import { BaseDisplayProperties, EventDisplayDetails } from "./types"
import { VIEW_NAMES } from "../../Views"
import { MonthSpanStrategy } from "../../Views/Month/displayStrategies/span"
import { MonthSplitStrategy } from "../../Views/Month/displayStrategies/split"
import { MonthStackStrategy } from "../../Views/Month/displayStrategies/stack"
import { WeekOverlapStrategy } from "../../Views/Week/displayStrategies/overlap"
import { CalendarLocalizer } from "../localizers"

export * from "./types"
export * from "./BaseDisplayStrategy"
export * from "./useDisplayStrategy"

export const displayStrategyFactories = {
	month: {
		split: (config: StrategyConfig) => new MonthSplitStrategy(config),
		stack: (config: StrategyConfig) => new MonthStackStrategy(config),
		span: (config: StrategyConfig) => new MonthSpanStrategy(config),
	},
	week: {
		overlap: (config: StrategyConfig) => new WeekOverlapStrategy(config),
	},
	// day: { ... },
	// agenda: { ... },
} as const

export type DisplayStrategyFactories = typeof displayStrategyFactories
export type ViewStrategyName<V extends keyof DisplayStrategyFactories> = keyof DisplayStrategyFactories[V]
export type StrategyNameMap = {
	[V in VIEW_NAMES]: V extends keyof DisplayStrategyFactories ? ViewStrategyName<V> : never
}

/**
 * Filters events based on view range and processes them using a given strategy instance.
 * Groups the resulting display details by day.
 */
export const groupAndFilterEvents = <
	T extends CalendarGenerics,
	P extends BaseDisplayProperties
>(
	view: VIEW_NAMES,
	strategy: BaseDisplayStrategy<T, P>,
	events: T["Event"][],
	date: Date,
	localizer: CalendarLocalizer
) => {
	const firstDay = localizer.firstVisibleDay(date, view)
	const lastDay = localizer.lastVisibleDay(date, view)

	const groupedEvents = new Map<string, SortedArray<EventDisplayDetails<T, P>>>()

	events.forEach(event => {
		// Ignore events outside visible range for current view
		if(!localizer.isAfter(event.end, firstDay) || !localizer.isBefore(event.start, lastDay)) return

		strategy.processEvent(event).forEach(processedEvent => {
			const sortingKey = localizer.startOf(processedEvent.displayProperties.displayStart, "day").toISOString()

			if(!groupedEvents.has(sortingKey)) {
				groupedEvents.set(sortingKey, new SortedArray(strategy.compare.bind(strategy)))
			}

			groupedEvents.get(sortingKey)!.push(processedEvent)
		})
	})

	return groupedEvents
}
