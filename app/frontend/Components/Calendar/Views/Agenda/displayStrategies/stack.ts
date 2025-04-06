import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import { DisplayStrategyFunction, EventDisplayDetails, EventDisplayProperties } from "@/Components/Calendar/lib/displayStrategies/DisplayStrategyManager"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

const compareAgendaStack = <T extends CalendarGenerics>(
	a: EventDisplayDetails<T>,
	b: EventDisplayDetails<T>
) => {
	// Agenda stack strategy: sort by start time then duration
	const startDiff = a.event.start.valueOf() - b.event.start.valueOf()
	if(startDiff !== 0) return startDiff

	const durationA = a.event.end.valueOf() - a.event.start.valueOf()
	const durationB = b.event.end.valueOf() - b.event.start.valueOf()
	return durationB - durationA
}

export const agendaStackStrategy: DisplayStrategyFunction<CalendarGenerics> = <T extends CalendarGenerics>(
	event: T["Event"],
	localizer: CalendarLocalizer
) => {
	const displayProperties: EventDisplayProperties = {
		displayStart: event.start,
		displayEnd: event.end,
		columnStart: 1,
		columnSpan: 1,
		className: clsx("filled"),
	}

	return [{
		event,
		displayProperties,
		compare: compareAgendaStack<T>,
	}]
}
