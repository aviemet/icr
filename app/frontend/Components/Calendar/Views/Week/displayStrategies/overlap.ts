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
 * Week Overlap Strategy:
 * - Splits events by day boundaries.
 * - Calculates column based on day of week.
 * - Calculates row based on time slots using `timeIncrement` and `startTime` from config.
 * - Renders each segment as a filled block.
 */
export class WeekOverlapStrategy<TResources extends Resources>
	extends BaseDisplayStrategy<TResources, TimeGridDisplayProperties> {
	processEvent(event: CalendarEvent<TResources>): EventDisplayDetails<TResources, TimeGridDisplayProperties>[] {
		// 1. Split event into daily segments
		const daySegments = this.splitAtDayBoundaries(event)

		// 2. Generate display details for each segment
		const processedDetails: EventDisplayDetails<TResources, TimeGridDisplayProperties>[] = []

		// Get view columns and total from config
		const { viewColumns, localizer } = this.config
		if(!viewColumns || viewColumns.length === 0) {
			// eslint-disable-next-line no-console
			console.error("WeekOverlapStrategy requires viewColumns in config.")
			return [] // Skip event if config is missing
		}
		const totalColumns = viewColumns.length

		for(let index = 0; index < daySegments.length; index++) {
			const segment = daySegments[index]

			// Find the column index for this segment's start day
			const segmentStartDay = localizer.startOf(segment.displayStart, "day")
			const columnIndex = viewColumns.findIndex(colDate =>
				localizer.isSame(colDate, segmentStartDay, "day")
			)

			if(columnIndex === - 1) {
				// eslint-disable-next-line no-console
				console.warn("Segment start date not found in viewColumns for event", event.id, segment)
				continue // Skip this segment
			}

			// Calculate grid placement using the simplified base method
			const gridPlacement = this.calculateTimeGridPlacement(columnIndex, totalColumns)

			// Calculate time grid rows
			const timeRows = this.calculateTimeGridRows(
				segment.displayStart,
				segment.displayEnd
			)

			// If row or column calculation fails, skip this segment/event
			if(!timeRows || !gridPlacement) {
				// eslint-disable-next-line no-console
				console.warn(`Skipping event segment due to missing grid/time config or placement error: ${event.id}`, segment)
				// If one segment fails, should we skip the whole event?
				// Let's return empty array for the whole event if any segment fails for simplicity.
				return []
			}

			const displayProperties: TimeGridDisplayProperties = {
				displayStart: segment.displayStart,
				displayEnd: segment.displayEnd,
				columnStart: gridPlacement.columnStart,
				columnSpan: gridPlacement.columnSpan, // Use span from placement (currently 1)
				rowStart: timeRows.rowStart,
				rowEnd: timeRows.rowEnd,
				className: clsx(
					"filled",
					this.getContinuationClasses(index, daySegments.length)
				),
			}

			processedDetails.push({
				// Use original event identity
				event: event,
				displayProperties,
				compare: this.compare,
			})
		}

		return processedDetails
	}

	/**
	 * Compares two event details for sorting.
	 * Week overlap sorts by segment duration, then segment start time.
	 */
	compare(a: EventDisplayDetails<TResources, TimeGridDisplayProperties>, b: EventDisplayDetails<TResources, TimeGridDisplayProperties>): number {
		const durationA = a.displayProperties.displayEnd.valueOf() - a.displayProperties.displayStart.valueOf()
		const durationB = b.displayProperties.displayEnd.valueOf() - b.displayProperties.displayStart.valueOf()
		const durationDiff = durationB - durationA // Longer duration first
		if(durationDiff !== 0) return durationDiff

		// If durations are equal, earlier start time first
		return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
	}
}
