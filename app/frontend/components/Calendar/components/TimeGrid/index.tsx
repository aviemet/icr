import clsx from "clsx"
import { useMemo, useRef } from "react"

import useStickySentinel from "@/lib/hooks/useStickySentinel"

import { EventResources, useCalendarContext } from "../../"
import { EventNode } from "./components/Event"
import TimeColumn from "./components/TimeColumn"
import { TimeIndicator } from "./components/TimeIndicator"
import * as classes from "./TimeGrid.css"
import { CalendarTransitionContainer } from "../../lib/CalendarTransitionContainer"
import {
	useDisplayStrategy,
	ViewStrategyName,
	TimeGridDisplayProperties,
} from "../../lib/displayStrategies"

export interface TimeGridHeading {
	date: Date
	label: string
	resourceId?: string | number
}

interface TimeGridProps<
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

const TimeGrid = <
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
}: TimeGridProps<TEventResources, V>) => {
	const { localizer, onEventClick, groupByResource } = useCalendarContext<TEventResources>()

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

	// Separate all-day events from standard events to be
	// rendered in different sections
	const { allDayEvents, standardEvents } = useMemo(() => {
		const result = {
			allDayEvents: [] as React.ReactNode[],
			standardEvents: [] as React.ReactNode[],
		}

		columnHeadings.forEach((heading) => {
			const key = groupByResource && heading.resourceId !== undefined
				? String(heading.resourceId)
				: localizer.startOf(heading.date, "day").toISOString()

			const columnEvents = eventsByColumn?.get(key)
			if(!columnEvents) return

			columnEvents.forEach(({ event, displayProperties }) => {
				const eventNode = (
					<EventNode<TEventResources>
						key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
						event={ event }
						displayProperties={ displayProperties }
						startTime={ localStartTime }
						timeIncrement={ timeIncrement }
						onEventClick={ onEventClick }
					/>
				)

				if(event.allDay) {
					result.allDayEvents.push(eventNode)
				} else {
					result.standardEvents.push(eventNode)
				}
			})
		})

		return result
	}, [columnHeadings, eventsByColumn, localizer, groupByResource, localStartTime, timeIncrement, onEventClick])

	return (
		<div
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
			<div ref={ headerRef } className={ clsx(classes.headerArea, {
				"stuck": !isStuck,
			}) }>
				<div className={ clsx(classes.cornerSpacer) } />

				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<div className={ clsx(classes.columnHeadings) }>
						{ columnHeadings.map((heading, index) => (
							<div key={ index } className={ clsx(classes.columnHeading) }>
								{ heading.label }
							</div>
						)) }
					</div>
				</CalendarTransitionContainer>
			</div>

			{ /* All Day Events */ }
			<div className={ clsx(classes.allDaySection) }>
				<div className={ clsx(classes.cornerSpacer) } />
				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<div className={ clsx(classes.allDayEvents) }>
						{ allDayEvents }
					</div>
				</CalendarTransitionContainer>
			</div>

			{ /* Standard Events */ }
			<div className={ clsx(classes.eventsSection) }>
				<TimeColumn
					start={ localStartTime }
					end={ localEndTime }
					increment={ timeIncrement }
				/>

				{ /* Render standard timed events */ }
				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<div
						ref={ contentAreaRef }
						className={ clsx(classes.contentArea) }
						style={ { "--rows-per-day": rowsPerDay } as React.CSSProperties }
					>
						<div className={ clsx(classes.gridLines) } />
						<TimeIndicator containerRef={ contentAreaRef } />
						<div className={ clsx(classes.eventsContainer) }>
							{ standardEvents }
						</div>
					</div>
				</CalendarTransitionContainer>
			</div>
		</div>
	)
}

export default TimeGrid
