import clsx from "clsx"
import { useCallback, useMemo, useRef } from "react"

import { Box } from "@/components"
import { assignEventOverlaps } from "@/components/Calendar/lib/assignEventOverlaps"
import { useStickySentinel } from "@/lib/hooks/useStickySentinel"

import { BaseCalendarEvent, EventResources, useCalendarContext } from "../../"
import { EventNode } from "./components/Event"
import * as eventClasses from "./components/Event/Event.css"
import { TimeColumn } from "./components/TimeColumn"
import { TimeIndicator } from "./components/TimeIndicator"
import {
	getTimeGridSlotAnchorBox,
	resolveTimeGridBackgroundClick,
} from "./resolveTimeGridBackgroundClick"
import * as classes from "./TimeGrid.css"
import { CalendarTransitionContainer } from "../../lib/CalendarTransitionContainer"
import { useDisplayStrategy, ViewStrategyName } from "../../lib/displayStrategies"
import {
	TimeGridDisplayProperties,
} from "../../lib/displayStrategies/types"
import * as baseEventClasses from "../Event/Event.css"

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

	const animationContainerRef = useRef<HTMLDivElement>(null)
	const contentAreaRef = useRef<HTMLDivElement>(null)
	const eventsContainerRef = useRef<HTMLDivElement>(null)
	const slotAnchorRef = useRef<HTMLDivElement>(null)

	const handleBackgroundClick = useCallback((mouseEvent: React.MouseEvent<HTMLDivElement>) => {
		if(!(mouseEvent.target instanceof HTMLElement)) return
		if(
			mouseEvent.target.closest(`.${eventClasses.eventWrapper}`)
			|| mouseEvent.target.closest(`.${baseEventClasses.event}`)
		) {
			return
		}

		const eventsContainer = eventsContainerRef.current
		const slotAnchor = slotAnchorRef.current
		if(!eventsContainer || !slotAnchor) return

		const resolved = resolveTimeGridBackgroundClick({
			clientX: mouseEvent.clientX,
			clientY: mouseEvent.clientY,
			container: eventsContainer,
			columnHeadings,
			timeIncrement,
			localizer,
		})
		if(!resolved) return

		const eventsRect = eventsContainer.getBoundingClientRect()
		const anchorBox = getTimeGridSlotAnchorBox({
			containerWidth: eventsRect.width,
			containerHeight: eventsRect.height,
			columnCount: columnHeadings.length,
			columnIndex: resolved.columnIndex,
			rowIndex: resolved.rowIndex,
			timeIncrement,
		})
		if(!anchorBox) return

		slotAnchor.style.left = `${anchorBox.left}px`
		slotAnchor.style.top = `${anchorBox.top}px`
		slotAnchor.style.width = `${anchorBox.width}px`
		slotAnchor.style.height = `${anchorBox.height}px`

		onClick({
			type: "background",
			date: resolved.date,
			time: resolved.time,
			resourceId: resolved.resourceId,
			element: slotAnchor,
		})
	}, [columnHeadings, localizer, onClick, timeIncrement])

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
						onClick={ handleBackgroundClick }
					>
						<Box className={ clsx(classes.gridLines) } />

						<TimeIndicator containerRef={ contentAreaRef } />

						<Box ref={ eventsContainerRef } className={ clsx(classes.eventsContainer) }>
							{ columnHeadings.map((heading, columnIndex) => {
								const key = groupByResource && heading.resourceId !== undefined
									? String(heading.resourceId)
									: localizer.startOf(heading.date, "day").toISOString()

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
							<Box
								ref={ slotAnchorRef }
								className={ clsx(classes.slotAnchor) }
								aria-hidden
							/>
						</Box>
					</Box>
				</CalendarTransitionContainer>
			</Box>
		</Box>
	)
}
