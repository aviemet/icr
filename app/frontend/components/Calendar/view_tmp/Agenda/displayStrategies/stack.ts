import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import {
	BaseDisplayStrategy,
} from "@/components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	AgendaDisplayProperties,
} from "@/components/Calendar/lib/displayStrategies/types"

/**
 * Agenda Stack Strategy
 * - Groups events by day
 * - Sorts events by all-day status (all-day first), then start time, then duration
 */
export class AgendaStackStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, AgendaDisplayProperties> {

	processEvent(event: BaseCalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, AgendaDisplayProperties>[] {
		const displayProperties: AgendaDisplayProperties = {
			displayStart: event.start,
			displayEnd: event.end,
			className: clsx({
				"all-day": event.allDay,
			}),
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
	 * Agenda stack strategy: sort by all-day status (all-day first), then start time, then duration.
	 */
	compare(a: EventDisplayDetails<TEventResources, AgendaDisplayProperties>, b: EventDisplayDetails<TEventResources, AgendaDisplayProperties>): number {
		// All-day events come first
		if(a.event.allDay !== b.event.allDay) {
			return a.event.allDay ? - 1 : 1
		}

		// Sort by start time
		const startDiff = a.event.start.valueOf() - b.event.start.valueOf()
		if(startDiff !== 0) return startDiff

		// For events with same start time, longer duration first
		const durationA = a.event.end.valueOf() - a.event.start.valueOf()
		const durationB = b.event.end.valueOf() - b.event.start.valueOf()
		return durationB - durationA
	}
}
