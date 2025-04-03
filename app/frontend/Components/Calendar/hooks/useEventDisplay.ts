import { useMemo } from "react"

import { CalendarEvent } from "@/Components/Calendar"

import { CalendarLocalizer } from "../lib/localizers"
import { DisplayStrategy } from "../Views/Month/displayStrategies"

interface EventDisplayResult {
	className: string
}

export function useEventDisplay<TEvent extends CalendarEvent = CalendarEvent>(
	event: TEvent,
	strategy: DisplayStrategy,
	localizer: CalendarLocalizer
): EventDisplayResult {
	return useMemo(() => {
		const startDay = localizer.startOf(event.start, "day")
		const endDay = localizer.startOf(event.end, "day")
		const spansMultipleDays = startDay.getTime() !== endDay.getTime()

		switch(strategy) {
			case "span":
				// Span strategy: filled if it spans days, indicator if it doesn't
				return {
					className: spansMultipleDays ? "filled" : "indicator",
				}
			case "stack":
				// Stack strategy: filled if it spans 2+ days, indicator if it doesn't
				const daysDiff = Math.floor((endDay.getTime() - startDay.getTime()) / (24 * 60 * 60 * 1000))
				return {
					className: daysDiff >= 2 ? "filled" : "indicator",
				}
			case "split":
				// Split strategy: always indicator as events are split into individual days
				return {
					className: "indicator",
				}
			default:
				return {
					className: "indicator",
				}
		}
	}, [event.start, event.end, strategy, localizer])
}
