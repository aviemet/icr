import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import {
	DisplayStrategyFunction,
	EventDisplayDetails,
	EventDisplayProperties,
} from "@/Components/Calendar/lib/displayStrategies"
import { calculateGridPlacement, splitAtDayBoundaries } from "@/Components/Calendar/lib/eventLayout"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

const compareWeekOverlap = <T extends CalendarGenerics>(
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => {
	// Week stack strategy: sort by duration then start time
	const durationA = a.displayProperties.displayEnd.valueOf() - a.displayProperties.displayStart.valueOf()
	const durationB = b.displayProperties.displayEnd.valueOf() - b.displayProperties.displayStart.valueOf()
	const durationDiff = durationB - durationA
	if(durationDiff !== 0) return durationDiff

	return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
}

export const weekOverlapStrategy: DisplayStrategyFunction<CalendarGenerics> = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	const startDay = localizer.startOf(event.start, "day")
	const endDay = localizer.startOf(localizer.adjustMidnightTime(event.end), "day")
	const spansMultipleDays = startDay.getTime() !== endDay.getTime()

	const splitEvents = spansMultipleDays
		? splitAtDayBoundaries<T>(event, localizer)
		: [{
			event,
			displayStart: event.start,
			displayEnd: event.end,
		}]

	return splitEvents.map((processed, index) => {
		const displayProperties: EventDisplayProperties = {
			...calculateGridPlacement(processed.event, localizer),
			displayStart: processed.displayStart,
			displayEnd: processed.displayEnd,
			className: clsx("filled", {
				"continues-on": splitEvents.length > 1 && index < splitEvents.length - 1,
				"continued-from": splitEvents.length > 1 && index !== 0,
			}),
		}

		return {
			event: processed.event,
			displayProperties,
			compare: compareWeekOverlap,
		}
	})
}
