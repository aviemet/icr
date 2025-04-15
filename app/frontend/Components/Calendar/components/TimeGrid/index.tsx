import clsx from "clsx"
import { useMemo, useRef } from "react"

import { EventResources, useCalendarContext } from "../../"
import {
	useDisplayStrategy,
	ViewStrategyName,
	TimeGridDisplayProperties,
} from "../../lib/displayStrategies"
import { Event } from "./components/Event/Event"
import { EventWrapper } from "./components/Event/EventWrapper"
import Headings from "./components/Headings"
import TimeColumn from "./components/TimeColumn"
import * as classes from "./TimeGrid.css"
import { CalendarTransitionContainer } from "../../lib/CalendarTransitionContainer"

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

	const localStartTime = startTime || localizer.startOf(new Date(), "day")
	const localEndTime = endTime || localizer.endOf(new Date(), "day")

	const timeSlots = useMemo(() => {
		const slots: Date[] = []

		let current = localizer.startOf(localStartTime, "hour")
		const boundaryTime = localizer.add(localizer.startOf(localEndTime, "hour"), 1, "hour")

		while(localizer.isBefore(current, boundaryTime)) {
			slots.push(current)
			current = localizer.add(current, timeIncrement, "minute")
		}

		return slots
	}, [localStartTime, localEndTime, timeIncrement, localizer])

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

	return (
		<div
			ref={ animationContainerRef }
			data-calendar-view="time-grid"
			className={ clsx(classes.timeGrid, className) }
			style={ {
				"--rows-per-day": rowsPerDay,
				"--column-count": columnHeadings.length,
				...style,
			} as React.CSSProperties }>
			<div className={ classes.cornerSpacer } />

			<CalendarTransitionContainer containerRef={ animationContainerRef }>
				<Headings columnHeadings={ columnHeadings } />
			</CalendarTransitionContainer>

			<TimeColumn timeSlots={ timeSlots } />

			<div className={ classes.contentArea } style={ { "--rows-per-day": rowsPerDay } as React.CSSProperties }>
				<CalendarTransitionContainer containerRef={ animationContainerRef }>
					<div className={ classes.gridLines } />
					<div className={ classes.eventsContainer }>
						{ columnHeadings.map((heading, columnIndex) => {
							// Determine the correct key based on grouping
							const key = groupByResource && heading.resourceId !== undefined
								? String(heading.resourceId)
								: localizer.startOf(heading.date, "day").toISOString()

							const columnEvents = eventsByColumn?.get(key)

							if(!columnEvents) return null

							return columnEvents.map(({ event, displayProperties }) => {
								return (
									<EventWrapper<TEventResources>
										key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
										event={ event }
										displayProperties={ displayProperties }
									>
										<Event<TEventResources>
											key={ event.id }
											event={ event }
											localizer={ localizer }
											displayProperties={ displayProperties }
											startTime={ localStartTime }
											timeIncrement={ timeIncrement }
											className={ clsx(displayProperties.className, classes.timeGridEvent) }
											onEventClick={ onEventClick }
										/>
									</EventWrapper>
								)
							})
						}) }
					</div>
				</CalendarTransitionContainer>
			</div>
		</div>
	)
}

export default TimeGrid
