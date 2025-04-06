import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import { DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/DisplayStrategyManager"
import { calculateGridPlacement } from "@/Components/Calendar/lib/eventLayout"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

const compareDayStack = <T extends CalendarGenerics>(
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => {
	// Day stack strategy: sort by duration then start time
	const durationA = a.event.end.valueOf() - a.event.start.valueOf()
	const durationB = b.event.end.valueOf() - b.event.start.valueOf()
	const durationDiff = durationB - durationA
	if(durationDiff !== 0) return durationDiff

	return a.event.start.valueOf() - b.event.start.valueOf()
}

export const dayStackStrategy: DisplayStrategyFunction<CalendarGenerics> = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	const displayProperties: EventDisplayProperties = {
		...calculateGridPlacement(event, localizer),
		displayStart: event.start,
		displayEnd: event.end,
		className: clsx("filled"),
	}

	return [{
		event,
		displayProperties,
		compare: compareDayStack<T>,
	}]
}
