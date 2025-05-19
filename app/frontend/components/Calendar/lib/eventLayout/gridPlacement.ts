import { BaseCalendarEvent, EventResources } from "../.."
import { CalendarLocalizer } from "../localizers"

/**
 * Calculates the grid column placement for an event in a calendar view
 */
export const calculateGridPlacement = <TEventResources extends EventResources = EventResources>(
	event: BaseCalendarEvent<TEventResources>,
	localizer: CalendarLocalizer
) => {
	const startDay = localizer.dayOfWeek(event.start)
	const endDay = localizer.dayOfWeek(event.end)

	const columnStart = startDay + 1
	const columnSpan = (endDay < startDay ? endDay + 7 : endDay) - startDay + 1

	return { columnStart, columnSpan }
}
