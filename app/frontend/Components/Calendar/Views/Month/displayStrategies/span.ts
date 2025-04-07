import clsx from "clsx"

import { CalendarGenerics } from "@/Components/Calendar"
import {
	BaseDisplayStrategy,
} from "@/Components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	GridDisplayProperties,
} from "@/Components/Calendar/lib/displayStrategies/types"

/**
 * Month Span Strategy:
 * - Splits events only if they cross week boundaries.
 * - Events are rendered spanning the columns representing the days they cover within a week.
 * - Can render as 'filled' or 'indicator' based on duration within the segment.
 */
export class MonthSpanStrategy<T extends CalendarGenerics>
	extends BaseDisplayStrategy<T, GridDisplayProperties> {
	processEvent(event: T["Event"]): EventDisplayDetails<T, GridDisplayProperties>[] {
		// 1. Split by week boundaries if necessary
		const weekSegments: T["Event"][] = this.spansWeekBorder(event)
			? this.splitAtWeekBoundaries(event)
			: [{ ...event }] // Use a shallow copy

		// 2. Generate display details for each week segment
		return weekSegments.map((segment, index) => {
			// Determine if the segment itself spans multiple days (for styling)
			const doesSpanMultipleDays = !this.config.localizer.isSame(
				segment.start,
				segment.end,
				"day"
			)

			// Calculate grid placement for the segment
			const gridPlacement = this.calculateMonthGridPlacement(segment)

			const displayProperties: GridDisplayProperties = {
				displayStart: segment.start,
				displayEnd: segment.end,
				columnStart: gridPlacement.columnStart,
				columnSpan: gridPlacement.columnSpan,
				className: clsx(
					doesSpanMultipleDays ? "filled" : "indicator",
					this.getContinuationClasses(index, weekSegments.length)
				),
			}

			return {
				// Use the *original* event object for identity, but the segment for display times
				event: event,
				displayProperties,
				compare: this.compare, // Use the class's compare method
			}
		})
	}

	/**
	 * Compares two event details for sorting.
	 * Span strategy prioritizes longer events (wider columnSpan),
	 * then falls back to start time.
	 */
	compare(a: EventDisplayDetails<T, GridDisplayProperties>, b: EventDisplayDetails<T, GridDisplayProperties>): number {
		// Longer spans first
		const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
		if(spanDiff !== 0) return spanDiff

		// If spans are equal, earlier start time first
		// Use displayStart as it reflects the segment's position
		return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
	}
}
