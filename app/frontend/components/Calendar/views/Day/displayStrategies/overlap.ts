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
 * Day Overlap Strategy:
 * - Assumes events are already filtered for the correct day OR resource column.
 * - Calculates row based on time slots using `timeIncrement` and `startTime` from config.
 * - Assigns column 1 / span 1 by default (grouping handles the column distinction).
 */
export class DayOverlapStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, TimeGridDisplayProperties> {

	processEvent(event: BaseCalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, TimeGridDisplayProperties>[] {
		const { columnHeadings, localizer } = this.config
		if(!columnHeadings || columnHeadings.length === 0) {
			// eslint-disable-next-line no-console
			console.error("DayOverlapStrategy requires columnHeadings in config.")
			return []
		}

		// Handle all-day events differently
		if(event.allDay) {
			const displayProperties: TimeGridDisplayProperties = {
				displayStart: event.start,
				displayEnd: event.end,
				columnStart: 1,
				columnSpan: 1,
				rowStart: 1,
				rowEnd: 2,
				className: "filled",
			}

			return [{
				event,
				displayProperties,
				compare: this.compare,
			}]
		}

		// Handle regular events
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
	 * Day overlap strategy: sort by duration then start time.
	 */
	compare(a: EventDisplayDetails<TEventResources, TimeGridDisplayProperties>, b: EventDisplayDetails<TEventResources, TimeGridDisplayProperties>): number {
		// All-day events should always be at the top
		if(a.event.allDay && !b.event.allDay) return - 1
		if(!a.event.allDay && b.event.allDay) return 1
		if(a.event.allDay && b.event.allDay) {
			return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		}

		const durationA = a.displayProperties.displayEnd.valueOf() - a.displayProperties.displayStart.valueOf()
		const durationB = b.displayProperties.displayEnd.valueOf() - b.displayProperties.displayStart.valueOf()
		const durationDiff = durationB - durationA
		if(durationDiff !== 0) return durationDiff

		return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
	}
}
