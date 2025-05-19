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
 * Month Stack Strategy:
 * - Splits events only if they cross week boundaries AND span multiple days.
 * - Renders events spanning multiple days within a week as a full span ("filled").
 * - Renders single-day events or segments as indicators ("indicator") in their start column.
 */
export class MonthStackStrategy<TEventResources extends EventResources>
	extends BaseDisplayStrategy<TEventResources, GridDisplayProperties> {
	/**
	 * Helper to determine if an event segment should be rendered as a full span.
	 * Based on the original logic: only spans if it covers 2 or more days.
	 */
	protected shouldSpanDays(segment: { start: Date, end: Date }): boolean {
		const startDay = this.config.localizer.startOf(segment.start, "day")
		const endDay = this.config.localizer.startOf(segment.end, "day")

		const daysDiff = Math.floor((endDay.getTime() - startDay.getTime()) / (1000 * 60 * 60 * 24))

		return daysDiff >= 1
	}

	/**
	 * Helper to determine if an event needs splitting at week boundaries.
	 * Based on original logic: only splits if it crosses a week border AND should span days.
	 */
	protected shouldSplitAtWeekBoundary(event: BaseCalendarEvent<TEventResources>): boolean {
		return this.spansWeekBorder(event) && this.shouldSpanDays(event)
	}

	processEvent(event: BaseCalendarEvent<TEventResources>): EventDisplayDetails<TEventResources, GridDisplayProperties>[] {
		const weekSegments: BaseCalendarEvent<TEventResources>[] = this.shouldSplitAtWeekBoundary(event)
			? this.splitAtWeekBoundaries(event)
			: [{ ...event }]

		return weekSegments.map((segment, index): EventDisplayDetails<TEventResources, GridDisplayProperties> => {
			const gridPlacement = this.calculateMonthGridPlacement(segment)
			const shouldRenderAsSpan = this.shouldSpanDays(segment)

			let displayProperties: GridDisplayProperties

			if(shouldRenderAsSpan) {
				displayProperties = {
					displayStart: segment.start,
					displayEnd: segment.end,
					allDay: event.allDay,
					columnStart: gridPlacement.columnStart,
					columnSpan: gridPlacement.columnSpan,
					className: clsx("filled", this.getContinuationClasses(index, weekSegments.length), {
						[classes.allDayEvent]: event.allDay,
					}),
				}
			} else {
				displayProperties = {
					displayStart: segment.start,
					displayEnd: segment.end,
					allDay: event.allDay,
					columnStart: gridPlacement.columnStart,
					columnSpan: 1,
					className: clsx("indicator", {
						[classes.allDayEvent]: event.allDay,
					}),
				}
			}

			return {
				event: event,
				displayProperties,
				compare: this.compare,
			}
		})
	}

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
		const spanDiff = b.displayProperties.columnSpan - a.displayProperties.columnSpan
		if(spanDiff !== 0) return spanDiff
		return a.displayProperties.displayStart.valueOf() - b.displayProperties.displayStart.valueOf()
	}
}
