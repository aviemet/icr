import clsx from "clsx"
import { useMemo } from "react"

import { Box } from "@/Components"
import { CalendarEvent, useCalendarContext } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"
import useStore from "@/lib/store"

import { DisplayStrategyName, getDisplayStrategy } from "./strategies"
import * as classes from "./TimeGrid.css"

interface DayHeading {
	date: Date
	label: string
}

interface TimeGridProps {
	className?: string
	style?: React.CSSProperties
	startTime?: Date
	endTime?: Date
	columnHeadings: DayHeading[]
	/**
	 * Number of minutes between each time slot
	 * @default 30
	 */
	timeIncrement?: number
	/**
	 * How to display overlapping events
	 * @default "stack"
	 */
	displayStrategy?: DisplayStrategyName
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

const TimeGrid = ({
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
	displayStrategy = "stack",
}: TimeGridProps) => {
	const { localizer, events, onEventClick } = useCalendarContext()
	const { getContrastingColor } = useStore()
	const strategy = getDisplayStrategy(displayStrategy)

	const timeSlots = useMemo(() => {
		return generateTimeSlots(new Date(startTime), new Date(endTime), timeIncrement, localizer)
	}, [startTime, endTime, timeIncrement, localizer])

	const timeSlotStyle = useMemo(() => ({
		"--time-slot-height": `${timeIncrement / 30 * 60}px`,
	} as React.CSSProperties), [timeIncrement])

	const eventContainerStyle = useMemo(() => ({
		"--column-count": columnHeadings.length,
	} as React.CSSProperties), [columnHeadings.length])

	const eventsGroupedByColumn = useMemo(() => {
		const groupedEvents = new Map<number, CalendarEvent[]>()

		events.forEach(event => {
			const columnIndex = columnHeadings.findIndex(heading =>
				localizer.isSame(event.start, heading.date, "day")
			)

			if(columnIndex !== - 1) {
				const columnEvents = groupedEvents.get(columnIndex) || []
				columnEvents.push(event)
				groupedEvents.set(columnIndex, columnEvents)
			}
		})

		return groupedEvents
	}, [events, columnHeadings, localizer])

	const renderedEvents = useMemo(() => {
		const allRenderedEvents: JSX.Element[] = []

		eventsGroupedByColumn.forEach((columnEvents, columnIndex) => {
			columnEvents.forEach((event) => {
				const { column, startRow, span, width, left, zIndex } = strategy.calculatePosition(
					event,
					columnIndex,
					columnEvents,
					localizer
				)

				const eventColor = event.color || "var(--mantine-primary-color-filled)"
				const contrastingColor = getContrastingColor(eventColor)

				allRenderedEvents.push(
					<Box
						key={ event.id }
						className={ clsx(
							classes.event,
							...strategy.getClassNames()
						) }
						style={ {
							"--event-column": column,
							"--event-start-row": startRow,
							"--event-span": span,
							"--event-color": eventColor,
							"--contrasting-color": contrastingColor,
							"--event-width": width,
							"--event-left": left,
							"--event-z-index": zIndex,
						} as React.CSSProperties }
						onClick={ (e) => onEventClick?.(event, e.currentTarget) }
					>
						{ typeof event.title === "function"
							? event.title({ start: event.start, end: event.end })
							: event.title }
					</Box>
				)
			})
		})

		return allRenderedEvents
	}, [events, columnHeadings, localizer, onEventClick, getContrastingColor, strategy])

	return (
		<div className={ clsx(classes.timeGrid, className) } style={ style }>
			{ /* Corner spacer */ }
			<div className={ classes.cornerSpacer } />

			{ /* Column headings */ }
			<div className={ classes.headerArea }>
				<div className={ classes.columnHeadings }>
					{ columnHeadings.map((heading, index) => (
						<div key={ index } className={ classes.columnHeading }>
							{ heading.label }
						</div>
					)) }
				</div>
			</div>

			{ /* Time column */ }
			<div className={ classes.timeColumn }>
				{ timeSlots.map((time) => (
					<div key={ time.toISOString() } className={ classes.timeSlot } style={ timeSlotStyle }>
						{ localizer.format(time, "h:mm a") }
					</div>
				)) }
			</div>

			{ /* Content area with events */ }
			<div className={ classes.contentArea }>
				<div className={ classes.contentGrid }>
					{ /* Grid lines */ }
					<div className={ classes.gridLines } style={ timeSlotStyle } />
					<div className={ classes.eventContainer } style={ eventContainerStyle }>
						{ renderedEvents }
					</div>
				</div>
			</div>
		</div>
	)
}

export default TimeGrid
