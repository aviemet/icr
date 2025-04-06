import { CalendarGenerics } from "@/Components/Calendar"
import { SortedArray } from "@/lib/Collections/SortedArray"

import { type VIEW_NAMES } from "../../Views"
import { CalendarLocalizer } from "../localizers"

export type StrategyType = "split" | "stack" | "span";

export interface EventDisplayProperties {
	displayStart: Date
	displayEnd: Date
	columnStart: number
	columnSpan: number
	className?: string
}

export type CompareFunction<T extends CalendarGenerics> = (
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => number

export interface EventDisplayDetails<T extends CalendarGenerics> {
	event: T["Event"]
	displayProperties: EventDisplayProperties
	compare: CompareFunction<T>
}

export type DisplayStrategyFunction<T extends CalendarGenerics> = (
	event: T["Event"],
	localizer: CalendarLocalizer
) => EventDisplayDetails<T>[]

export class DisplayStrategyManager {
	private strategies = new Map<VIEW_NAMES, Map<StrategyType, DisplayStrategyFunction<any>>>()

	registerStrategy<T extends CalendarGenerics>(
		viewType: VIEW_NAMES,
		strategyType: StrategyType,
		strategy: DisplayStrategyFunction<T>
	) {
		if(!this.strategies.has(viewType)) {
			this.strategies.set(viewType, new Map())
		}
		this.strategies.get(viewType)!.set(strategyType, strategy)
	}

	getDisplayStrategy<T extends CalendarGenerics>(
		view: VIEW_NAMES,
		strategyType: StrategyType | DisplayStrategyFunction<T>,
	) {
		const strategy = typeof strategyType === "string"
			? this.strategies.get(view)?.get(strategyType)
			: strategyType

		if(!strategy) {
			throw new Error(`Strategy "${strategyType}" not found for ${view} view`)
		}

		return strategy as DisplayStrategyFunction<T>
	}

	groupAndFilterEvents<T extends CalendarGenerics>(
		view: VIEW_NAMES,
		strategyType: StrategyType | DisplayStrategyFunction<T>,
		events: T["Event"][],
		date: Date,
		localizer: CalendarLocalizer
	) {
		const strategy = this.getDisplayStrategy<T>(view, strategyType)

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
}
