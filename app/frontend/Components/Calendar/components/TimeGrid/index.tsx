import clsx from "clsx"
import { useMemo } from "react"

import { Box } from "@/Components"
import { CalendarGenerics, useCalendarContext } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import useStore from "@/lib/store"

import Headings from "./components/Headings"
import * as classes from "./TimeGrid.css"
import { columnHeadings } from "./TimeGrid.css"
import { displayStrategies } from "../../lib/displayStrategies"
import { useDisplayStrategy } from "../../lib/displayStrategies/useDisplayStrategy"
import { VIEWS } from "../../Views"
import TimeColumn from "./components/TimeColumn"

export interface TimeGridHeading {
	date: Date
	label: string
}

interface TimeGridProps {
	className?: string
	style?: React.CSSProperties
	startTime?: Date
	endTime?: Date
	columnHeadings: TimeGridHeading[]
	/**
	 * Number of minutes between each time slot
	 * @default 30
	 */
	timeIncrement?: number
	/**
	 * How to display overlapping events
	 * @default "overlap"
	 */
	displayStrategy?: keyof typeof displayStrategies["week"]
}

const generateTimeSlots = (start: Date, end: Date, increment: number, localizer: CalendarLocalizer) => {
	const slots: Date[] = []
	let current = localizer.startOf(start, "hour")
	const endTime = localizer.startOf(end, "hour")

	while(current <= endTime) {
		slots.push(current)
		current = localizer.add(current, increment, "minute")
	}

	return slots
}

const TimeGrid = <T extends CalendarGenerics = CalendarGenerics>({
	className,
	style,
	startTime = (() => {
		const date = new Date()
		date.setHours(0, 0, 0, 0)
		return date
	})(),
	endTime = (() => {
		const date = new Date()
		date.setHours(23, 59, 59, 999)
		return date
	})(),
	columnHeadings,
	timeIncrement = 30,
	displayStrategy = "overlap",
}: TimeGridProps) => {
	const { localizer, events, onEventClick } = useCalendarContext()
	const { getContrastingColor } = useStore()
	const eventsByDay = useDisplayStrategy<T, "week">(VIEWS.week, displayStrategy)

	const timeSlots = useMemo(() => {
		return generateTimeSlots(new Date(startTime), new Date(endTime), timeIncrement, localizer)
	}, [startTime, endTime, timeIncrement, localizer])

	const eventContainerStyle = useMemo(() => ({
		"--column-count": columnHeadings.length,
	} as React.CSSProperties), [columnHeadings.length])

	const renderedEvents = useMemo(() => {
		const allRenderedEvents: JSX.Element[] = []

		columnHeadings.forEach((heading, columnIndex) => {
			const dayEvents = eventsByDay.get(heading.date.toISOString())
			if(!dayEvents) return

			dayEvents.forEach(({ event, displayProperties }) => {
				const eventColor = event.color || "var(--mantine-primary-color-filled)"
				const contrastingColor = getContrastingColor(eventColor)

				allRenderedEvents.push(
					<Box
						key={ `${event.id}-${columnIndex}` }
						className={ clsx(
							classes.event,
							displayProperties.className
						) }
						style={ {
							"--event-column": displayProperties.columnStart,
							"--event-start-row": localizer.duration(displayProperties.displayStart, startTime) / timeIncrement,
							"--event-span": localizer.duration(displayProperties.displayEnd, displayProperties.displayStart) / timeIncrement,
							"--event-color": eventColor,
							"--contrasting-color": contrastingColor,
							"--event-width": `${100 / displayProperties.columnSpan}%`,
							"--event-left": `${(displayProperties.columnStart - 1) * (100 / displayProperties.columnSpan)}%`,
						} as React.CSSProperties }
						onClick={ (e) => onEventClick?.(event, e.currentTarget) }
					>
						{ typeof event.title === "function"
							? event.title({
								start: displayProperties.displayStart,
								end: displayProperties.displayEnd,
							})
							: event.title }
					</Box>
				)
			})
		})

		return allRenderedEvents
	}, [eventsByDay, columnHeadings, localizer, timeIncrement, startTime, getContrastingColor, onEventClick])

	return (
		<div className={ clsx(classes.timeGrid, className) } style={ {
			"--time-slot-height": `${timeIncrement / 30 * 60}px`,
		} as React.CSSProperties }>

			{ /* Corner spacer */ }
			<div className={ classes.cornerSpacer } />

			{ /* Column headings */ }
			<Headings columnHeadings={ columnHeadings } />

			{ /* Time column */ }
			<TimeColumn timeSlots={ timeSlots } />

			{ /* Content area with events */ }
			<div className={ classes.contentArea }>
				<div className={ classes.contentGrid }>
					{ /* Grid lines */ }
					<div className={ classes.gridLines } />
					<div className={ classes.eventContainer } style={ eventContainerStyle }>
						{ renderedEvents }
					</div>
				</div>
			</div>
		</div>
	)
}

export default TimeGrid
