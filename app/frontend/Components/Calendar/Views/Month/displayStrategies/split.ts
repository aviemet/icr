import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
// Import BaseDisplayStrategy directly from its source file
import {
	BaseDisplayStrategy,
} from "@/Components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
// Import other types from the types file (or index, assuming types are re-exported)
import {
	EventDisplayDetails,
	GridDisplayProperties,
} from "@/Components/Calendar/lib/displayStrategies/types"
// Remove unused imports from eventLayout if helpers are now in BaseDisplayStrategy
// import {
// 	calculateGridPlacement,
// 	spansWeekBorder,
// 	splitAtDayBoundaries,
// 	splitAtWeekBorders,
// } from "@/Components/Calendar/lib/eventLayout"
// No need to import CalendarLocalizer if only used via this.config.localizer
// import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

/**
 * Month Split Strategy:
 * - Splits events first by week boundaries if they cross.
 * - Then splits each resulting segment by day boundaries.
 * - Each final segment represents the event's presence on a single day.
 * - Renders as a filled block occupying one column.
 */
export class MonthSplitStrategy<T extends CalendarGenerics>
	extends BaseDisplayStrategy<T, GridDisplayProperties> {
	/**
	 * Processes an event, splitting it by week and day boundaries.
	 * Returns an array of display details, one for each day the event appears on.
	 */
	processEvent(event: T["Event"]): EventDisplayDetails<T, GridDisplayProperties>[] {
		// 1. Split by week boundaries if necessary
		const weekSegments: T["Event"][] = this.spansWeekBorder(event)
			? this.splitAtWeekBoundaries(event)
			: [{ ...event }] // Create a shallow copy to avoid modifying original

		// Define the type for day segments explicitly
		type DaySegment = { event: T["Event"], displayStart: Date, displayEnd: Date };

		// 2. Split each week segment by day boundaries
		const daySegments: DaySegment[] = weekSegments.flatMap((weekSegment: T["Event"]) =>
			this.splitAtDayBoundaries(weekSegment)
		)

		// 3. Generate display details for each single-day segment
		return daySegments.map((segment: DaySegment, index: number) => {
			// Calculate grid placement for the specific day segment
			// Pass the correct object shape { start, end } using segment's display times
			const gridPlacement = this.calculateMonthGridPlacement({
				...segment.event,
				start: segment.displayStart,
				end: segment.displayEnd,
			})

			const displayProperties: GridDisplayProperties = {
				displayStart: segment.displayStart,
				displayEnd: segment.displayEnd,
				columnStart: gridPlacement.columnStart,
				columnSpan: 1, // Split strategy always results in 1-day segments
				className: clsx(
					"filled", // Split events are typically shown as solid blocks
					this.getContinuationClasses(index, daySegments.length)
				),
			}

			return {
				event: segment.event, // Reference the original event
				displayProperties,
				compare: this.compare, // Use the class's compare method
			}
		})
	}

	/**
	 * Compares two event details for sorting.
	 * Split strategy sorts primarily by start time, as all segments are single-day.
	 */
	compare(a: EventDisplayDetails<T, GridDisplayProperties>, b: EventDisplayDetails<T, GridDisplayProperties>): number {
		// Use the displayStart of the segment for sorting, as it represents the specific day
		const startDiff = a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		if(startDiff !== 0) return startDiff

		// Optional: Secondary sort by duration or original event start if needed for tie-breaking
		// const durationA = a.displayProperties.displayEnd.valueOf() - a.displayProperties.displayStart.valueOf();
		// const durationB = b.displayProperties.displayEnd.valueOf() - b.displayProperties.displayStart.valueOf();
		// return durationB - durationA; // Example: Longer segments first on the same day

		return 0 // Default if start times are the same
	}
}
