import clsx from "clsx"

import { EventResources, BaseCalendarEvent } from "@/components/Calendar"
import {
	BaseDisplayStrategy,
} from "@/components/Calendar/lib/displayStrategies/BaseDisplayStrategy"
import {
	EventDisplayDetails,
	GridDisplayProperties,
} from "@/components/Calendar/lib/displayStrategies/types"

import * as classes from "../../../Calendar.css"

/**
 * Month Split Strategy:
 * - Splits events first by week boundaries if they cross.
 * - Then splits each resulting segment by day boundaries.
 * - Each final segment represents the event's presence on a single day.
 * - Renders as a filled block occupying one column.
 */
export class MonthSplitStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, GridDisplayProperties> {
	/**
	 * Processes an event, splitting it by week and day boundaries.
	 * Returns an array of display details, one for each day the event appears on.
	 */
	processEvent(event: BaseCalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, GridDisplayProperties>[] {
		const weekSegments: BaseCalendarEvent<TEventResources>[] = this.spansWeekBorder(event)
			? this.splitAtWeekBoundaries(event)
			: [{ ...event }]

		type DaySegment = { event: BaseCalendarEvent<TEventResources>, displayStart: Date, displayEnd: Date };

		const daySegments: DaySegment[] = weekSegments.flatMap((weekSegment: BaseCalendarEvent<TEventResources>) =>
			this.splitAtDayBoundaries(weekSegment)
		)

		return daySegments.map((segment: DaySegment, index: number): EventDisplayDetails<TEventResources, GridDisplayProperties> => {
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
				allDay: event.allDay,
				columnStart: gridPlacement.columnStart,
				columnSpan: event.allDay ? gridPlacement.columnSpan : 1,
				className: clsx(
					"filled", // Split events are typically shown as solid blocks
					this.getContinuationClasses(index, daySegments.length), {
						[classes.allDayEvent]: event.allDay,
					}
				),
			}

			return {
				event: segment.event,
				displayProperties,
				compare: this.compare,
			}
		})
	}

	/**
	 * Compares two event details for sorting.
	 * Split strategy sorts primarily by start time, as all segments are single-day.
	 */
	compare(a: EventDisplayDetails<TEventResources, GridDisplayProperties>, b: EventDisplayDetails<TEventResources, GridDisplayProperties>): number {
		// All-day events should always be at the top
		if(a.event.allDay && !b.event.allDay) return - 1
		if(!a.event.allDay && b.event.allDay) return 1
		if(a.event.allDay && b.event.allDay) {
			// For all-day events, sort by duration then start time
			const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
			if(spanDiff !== 0) return spanDiff
			return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		}

		// Other events sorted by start time
		const startDiff = a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
		if(startDiff !== 0) return startDiff

		return 0
	}
}
