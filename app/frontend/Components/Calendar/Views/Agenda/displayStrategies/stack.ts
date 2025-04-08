import clsx from "clsx"

import { Resources, CalendarEvent } from "@/Components/Calendar"
import {
	BaseDisplayStrategy,
} from "@/Components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	AgendaDisplayProperties,
} from "@/Components/Calendar/lib/displayStrategies/types"

/**
 * Agenda Stack Strategy (Placeholder/Basic Implementation)
 * - Renders event as a single entry.
 * - Sorting is done by start time, then duration.
 */
export class AgendaStackStrategy<TResources extends Resources>
	extends BaseDisplayStrategy<TResources, AgendaDisplayProperties> {

	processEvent(event: CalendarEvent<TResources>): EventDisplayDetails<TResources, AgendaDisplayProperties>[] {
		// Agenda view typically doesn't involve complex grid calculations
		// It just needs the event data and maybe basic display flags.
		const displayProperties: AgendaDisplayProperties = {
			displayStart: event.start,
			displayEnd: event.end,
			// className could indicate all-day, etc.
			className: clsx({ "all-day": event.allDay }),
			allDay: event.allDay,
		}

		return [{
			event,
			displayProperties,
			compare: this.compare,
		}]
	}

	/**
	 * Compares two event details for sorting.
	 * Agenda stack strategy: sort by start time then duration.
	 */
	compare(a: EventDisplayDetails<TResources, AgendaDisplayProperties>, b: EventDisplayDetails<TResources, AgendaDisplayProperties>): number {
		const startDiff = a.event.start.valueOf() - b.event.start.valueOf()
		if(startDiff !== 0) return startDiff

		const durationA = a.event.end.valueOf() - a.event.start.valueOf()
		const durationB = b.event.end.valueOf() - b.event.start.valueOf()
		return durationB - durationA // Longer duration first for same start time
	}
}
