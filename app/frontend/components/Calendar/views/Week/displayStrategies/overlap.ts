import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import {
	BaseDisplayStrategy,
} from "@/components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	TimeGridDisplayProperties,
} from "@/components/Calendar/lib/displayStrategies/types"

/**
 * Week Overlap Strategy:
 * - For regular events:
 *   - Splits events by day boundaries
 *   - Calculates column based on day of week
 *   - Calculates row based on time slots using timeIncrement and startTime
 * - For all-day events:
 *   - Only splits at week boundaries
 *   - Spans across days within the same week
 *   - Renders in the all-day section
 */
export class WeekOverlapStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, TimeGridDisplayProperties> {

	processEvent(event: BaseCalendarEvent<EventResources>): EventDisplayDetails<TEventResources, TimeGridDisplayProperties>[] {
		const { columnHeadings, localizer } = this.config
		if(!columnHeadings || columnHeadings.length === 0) {
			// eslint-disable-next-line no-console
			console.error("WeekOverlapStrategy requires columnHeadings in config.")
			return []
		}

		// Handle all-day events differently
		if(event.allDay) {
			// Split at week boundaries if necessary
			const weekSegments: BaseCalendarEvent<EventResources>[] = this.spansWeekBorder(event)
				? this.splitAtWeekBoundaries(event)
				: [{ ...event }]

			return weekSegments.map((segment, index) => {
				const segmentStartDay = localizer.startOf(segment.start, "day")
				const segmentEndDay = localizer.startOf(segment.end, "day")

				// Find the column indices for start and end
				const startColumnIndex = columnHeadings.findIndex(heading =>
					localizer.isSame(heading.date, segmentStartDay, "day")
				)

				const endColumnIndex = columnHeadings.findIndex(heading =>
					localizer.isSame(heading.date, segmentEndDay, "day")
				)

				if(startColumnIndex === - 1) {
					// eslint-disable-next-line no-console
					console.warn("Segment start date not found in columnHeadings for event", event.id, segment)
					return null
				}

				const columnSpan = endColumnIndex === - 1
					? columnHeadings.length - startColumnIndex
					: endColumnIndex - startColumnIndex + 1

				const displayProperties: TimeGridDisplayProperties = {
					displayStart: segment.start,
					displayEnd: segment.end,
					columnStart: startColumnIndex + 1,
					columnSpan,
					rowStart: 1,
					rowEnd: 2,
					className: clsx(
						"filled",
						this.getContinuationClasses(index, weekSegments.length)
					),
				}

				return {
					event,
					displayProperties,
					compare: this.compare,
				}
			}).filter((detail): detail is EventDisplayDetails<TEventResources, TimeGridDisplayProperties> => detail !== null)
		}

		// Handle regular events (original logic)
		const daySegments = this.splitAtDayBoundaries(event)
		const processedDetails: EventDisplayDetails<TEventResources, TimeGridDisplayProperties>[] = []

		const totalColumns = columnHeadings.length

		for(let index = 0; index < daySegments.length; index++) {
			const segment = daySegments[index]
			const segmentStartDay = localizer.startOf(segment.displayStart, "day")

			const columnIndex = columnHeadings.findIndex(heading =>
				localizer.isSame(heading.date, segmentStartDay, "day")
			)

			if(columnIndex === - 1) {
				// eslint-disable-next-line no-console
				console.warn("Segment start date not found in columnHeadings for event", event.id, segment)
				continue
			}

			const gridPlacement = this.calculateTimeGridPlacement(columnIndex, totalColumns)
			const timeRows = this.calculateTimeGridRows(
				segment.displayStart,
				segment.displayEnd
			)

			if(!timeRows || !gridPlacement) {
				// eslint-disable-next-line no-console
				console.warn(`Skipping event segment due to missing grid/time config or placement error: ${event.id}`, segment)
				return []
			}

			const displayProperties: TimeGridDisplayProperties = {
				displayStart: segment.displayStart,
				displayEnd: segment.displayEnd,
				columnStart: gridPlacement.columnStart,
				columnSpan: gridPlacement.columnSpan,
				rowStart: timeRows.rowStart,
				rowEnd: timeRows.rowEnd,
				className: clsx(
					"filled",
					this.getContinuationClasses(index, daySegments.length)
				),
			}

			processedDetails.push({
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
	compare(a: EventDisplayDetails<TEventResources, TimeGridDisplayProperties>, b: EventDisplayDetails<TEventResources, TimeGridDisplayProperties>): number {
		// All-day events should always be sorted among themselves by start time
		if(a.event.allDay && b.event.allDay) {
			return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		}

		// Regular events sorted by start time first
		const startDiff = a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		if(startDiff !== 0) return startDiff

		// If start times are equal, longer duration first
		const durationA = a.displayProperties.displayEnd.valueOf() - a.displayProperties.displayStart.valueOf()
		const durationB = b.displayProperties.displayEnd.valueOf() - b.displayProperties.displayStart.valueOf()
		return durationB - durationA
	}
}
