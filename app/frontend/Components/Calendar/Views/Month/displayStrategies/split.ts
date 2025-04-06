import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import { DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/DisplayStrategyManager"
import { calculateGridPlacement, spansWeekBorder, splitAtDayBoundaries, splitAtWeekBorders } from "@/Components/Calendar/lib/eventLayout"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"


const compareSplit = <T extends CalendarGenerics>(
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => {
	// Split strategy: sort by start time since all events are single-day
	return a.event.start.valueOf() - b.event.start.valueOf()
}

export const splitStrategy: DisplayStrategyFunction<CalendarGenerics> = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	// First split at week boundaries if needed
	const weekEvents = spansWeekBorder(event, localizer)
		? splitAtWeekBorders(event, localizer)
		: [event]

	// Then split each week segment at day boundaries
	const processedEvents = weekEvents.flatMap(weekEvent => {
		const startDay = localizer.startOf(weekEvent.start, "day")
		const endDay = localizer.startOf(localizer.adjustMidnightTime(weekEvent.end), "day")
		const spansMultipleDays = startDay.getTime() !== endDay.getTime()

		if(spansMultipleDays) {
			return splitAtDayBoundaries(weekEvent, localizer)
		} else {
			return [{
				event: weekEvent,
				displayStart: weekEvent.start,
				displayEnd: weekEvent.end,
			}]
		}
	})

	return processedEvents.map((processed, index) => {
		const displayProperties: EventDisplayProperties = {
			columnStart: calculateGridPlacement({
				...processed.event,
				start: processed.displayStart,
				end: processed.displayEnd,
			}, localizer).columnStart,
			columnSpan: 1, // Always single column since we split at day boundaries
			displayStart: processed.displayStart,
			displayEnd: processed.displayEnd,
			className: clsx("filled", {
				"continues-on": processedEvents.length > 1 && index < processedEvents.length - 1,
				"continued-from": processedEvents.length > 1 && index !== 0,
			}),
		}

		return {
			event: processed.event,
			displayProperties,
			compare: compareSplit,
		}
	})
}
