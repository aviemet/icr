import clsx from "clsx"
import { useCallback, useMemo, useRef } from "react"

import { Box } from "@/components"
import { assignEventOverlaps } from "@/components/Calendar/lib/assignEventOverlaps"
import { useStickySentinel } from "@/lib/hooks/useStickySentinel"

import { BaseCalendarEvent, EventResources, useCalendarContext } from "../../"
import { EventNode } from "./components/Event"
import { TimeColumn } from "./components/TimeColumn"
import { TimeIndicator } from "./components/TimeIndicator"
import * as classes from "./TimeGrid.css"
import { CalendarTransitionContainer } from "../../lib/CalendarTransitionContainer"
import { useDisplayStrategy, ViewStrategyName } from "../../lib/displayStrategies"
import {
	TimeGridDisplayProperties,
} from "../../lib/displayStrategies/types"

export interface TimeGridHeading {
	date: Date
	label: string
	resourceId?: string | number
}

export interface TimeGridProps<
	// eslint-disable-next-line no-unused-vars
	TEventResources extends EventResources,
	V extends "week" | "day" = "week"
> {
	className?: string
	style?: React.CSSProperties
	view: V
	startTime?: Date
	endTime?: Date
	columnHeadings: TimeGridHeading[]
	/**
	 * Number of minutes between each time slot
	 * @default 30
	 */
	timeIncrement?: number
	displayStrategy?: ViewStrategyName<V>
}

export function TimeGrid<
	TEventResources extends EventResources,
	V extends "week" | "day" = "week"
>({
	className,
	style,
	view,
	startTime,
	endTime,
	columnHeadings,
	timeIncrement = 60,
	displayStrategy = "overlap",
}: TimeGridProps<TEventResources, V>) {
	const { localizer, onClick, groupByResource } = useCalendarContext()

	const onEventClick = useCallback((event: BaseCalendarEvent<EventResources>, element: HTMLElement) => {
		onClick({ type: "event", event, element })
	}, [onClick])

	const [headerRef, isStuck] = useStickySentinel<HTMLDivElement>()

	const localStartTime = startTime || localizer.startOf(new Date(), "day")
	const localEndTime = endTime || localizer.endOf(new Date(), "day")

	const eventsByColumn = useDisplayStrategy<TEventResources, V, TimeGridDisplayProperties>(
		view,
		displayStrategy,
		{
			timeIncrement,
			startTime: localStartTime,
			endTime: localEndTime,
			columnHeadings,
		}
	)

	const rowsPerDay = (24 * 60) / timeIncrement

	const animationContainerRef = useRef<HTMLDivElement>(null)
	const contentAreaRef = useRef<HTMLDivElement>(null)

	// Separate all-day events from standard events to be rendered in different sections
	const { allDayEvents, standardEvents } = useMemo(() => {
		const result = {
			allDayEvents: [] as React.ReactNode[],
			standardEvents: Array(columnHeadings.length).fill(null).map(() => [] as React.ReactNode[]),
		}

		columnHeadings.forEach((heading, columnIndex) => {
			const key = groupByResource && heading.resourceId !== undefined
				? String(heading.resourceId)
				: localizer.startOf(heading.date, "day").toISOString()

			const columnEvents = eventsByColumn?.get(key)
			if(!columnEvents) return

			// Start overlapping event detection
			const overlapCounts = assignEventOverlaps(columnEvents)

			// Build the list of events per column
			columnEvents.forEach(({ event, displayProperties }, index) => {
				const eventKey = `${event.id}-${displayProperties.displayStart.toISOString()}-${columnIndex}-${index}`
				const eventNode = (displayProperties: TimeGridDisplayProperties) => (
					<EventNode
						key={ eventKey }
						event={ event }
						displayProperties={ displayProperties }
						startTime={ localStartTime }
						timeIncrement={ timeIncrement }
						onEventClick={ onEventClick }
					/>
				)

				if(event.allDay) {
					result.allDayEvents.push(eventNode(displayProperties))
				} else {
					// Inject slotIndex and groupSize for timed events
					const overlapData = overlapCounts.get(index)
					displayProperties.slotIndex = overlapData?.slotIndex ?? 0
					displayProperties.groupSize = overlapData?.groupSize ?? 1

					result.standardEvents[columnIndex].push(eventNode(displayProperties))
				}
			})
		})

		return result
	}, [columnHeadings, eventsByColumn, localizer, groupByResource, localStartTime, timeIncrement, onEventClick])

	return (
		<Box
			ref={ animationContainerRef }
			data-calendar-view="time-grid"
			className={ clsx(classes.timeGrid, className) }
			style={ {
				"--rows-per-day": rowsPerDay,
				"--column-count": columnHeadings.length,
				...style,
			} as React.CSSProperties }
		>

			{ /* Column Headers */ }
			<Box ref={ headerRef } className={ clsx(classes.headerArea, {
				"stuck": !isStuck,
			}) }>
				<Box className={ clsx(classes.cornerSpacer) } />

				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<Box className={ clsx(classes.columnHeadings) }>
						{ columnHeadings.map((heading, index) => (
							<Box key={ index } className={ clsx(classes.columnHeading) }>
								{ heading.label }
							</Box>
						)) }
					</Box>
				</CalendarTransitionContainer>
			</Box>

			{ /* All Day Events */ }
			<Box className={ clsx(classes.allDaySection) }>
				<Box className={ clsx(classes.cornerSpacer) } />
				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<Box className={ clsx(classes.allDayEvents) }>
						{ allDayEvents }
					</Box>
				</CalendarTransitionContainer>
			</Box>

			{ /* Standard Events */ }
			<Box className={ clsx(classes.eventsSection) }>
				<TimeColumn
					start={ localStartTime }
					end={ localEndTime }
					increment={ timeIncrement }
				/>

				{ /* Render standard timed events */ }
				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<Box
						ref={ contentAreaRef }
						className={ clsx(classes.contentArea) }
						style={ { "--rows-per-day": rowsPerDay } as React.CSSProperties }
					>
						<Box className={ clsx(classes.gridLines) } />

						<TimeIndicator containerRef={ contentAreaRef } />

						<Box className={ clsx(classes.eventsContainer) }>
							{ columnHeadings.map((heading, columnIndex) => {
								const key = groupByResource && heading.resourceId !== undefined
									? String(heading.resourceId)
									: localizer.startOf(heading.date, "day").toISOString()

								const columnEvents = eventsByColumn?.get(key)
								if(!columnEvents) return null

								return (
									<Box
										key={ key }
										className={ clsx(classes.dayColumn) }
										style={ {
											gridColumn: columnIndex + 1,
										} }
									>
										{ standardEvents[columnIndex] }
									</Box>
								)
							}) }
						</Box>
					</Box>
				</CalendarTransitionContainer>
			</Box>
		</Box>
	)
}
