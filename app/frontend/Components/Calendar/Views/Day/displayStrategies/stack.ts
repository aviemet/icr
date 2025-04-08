import clsx from "clsx"

import { Resources, CalendarEvent } from "@/Components/Calendar"
import {
	BaseDisplayStrategy,
} from "@/Components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	TimeGridDisplayProperties,
} from "@/Components/Calendar/lib/displayStrategies/types"

/**
 * Day Stack Strategy (Placeholder/Basic Implementation)
 * - Assumes TimeGrid properties.
 * - Renders event as a single filled block using calculated time rows.
 * - Does not currently implement sophisticated overlap/stacking logic.
 */
export class DayStackStrategy<TResources extends Resources>
	extends BaseDisplayStrategy<TResources, TimeGridDisplayProperties> {

	processEvent(event: CalendarEvent<TResources>): EventDisplayDetails<TResources, TimeGridDisplayProperties>[] {

		// Calculate time grid rows using helper from base class
		const timeRows = this.calculateTimeGridRows(event.start, event.end)

		// Assume day view has only one column for basic stacking
		const gridPlacement = this.calculateTimeGridPlacement(0, 1)

		// Basic handling if calculation fails
		if(!timeRows || !gridPlacement) {
			// eslint-disable-next-line no-console
			console.warn(`Skipping event due to missing grid/time config or placement error: ${event.id}`)
			return []
		}

		const displayProperties: TimeGridDisplayProperties = {
			displayStart: event.start,
			displayEnd: event.end,
			columnStart: gridPlacement.columnStart,
			columnSpan: gridPlacement.columnSpan, // Currently 1
			rowStart: timeRows.rowStart,
			rowEnd: timeRows.rowEnd,
			className: clsx("filled"),
		}

		return [{
			event,
			displayProperties,
			compare: this.compare,
		}]
	}

	/**
	 * Compares two event details for sorting.
	 * Day stack strategy: sort by duration then start time.
	 */
	compare(a: EventDisplayDetails<TResources, TimeGridDisplayProperties>, b: EventDisplayDetails<TResources, TimeGridDisplayProperties>): number {
		const durationA = a.event.end.valueOf() - a.event.start.valueOf()
		const durationB = b.event.end.valueOf() - b.event.start.valueOf()
		const durationDiff = durationB - durationA // Longer first
		if(durationDiff !== 0) return durationDiff

		return a.event.start.valueOf() - b.event.start.valueOf()
	}
}
