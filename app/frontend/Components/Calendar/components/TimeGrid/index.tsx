import clsx from "clsx"
import { useMemo } from "react"

import { Box } from "@/Components"
import { CalendarGenerics, useCalendarContext } from "@/Components/Calendar"
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
		const groupedEvents = new Map<number, T["Event"][]>()

		const splitAtDayBoundaries = (event: T["Event"], columnStart: Date, columnEnd: Date) => {
			const segments: T["Event"][] = []
			let currentStart = event.start
			let currentEnd = event.end

			while(localizer.startOf(currentStart, "day").getTime() !==
				   localizer.startOf(currentEnd, "day").getTime()) {
				// Find the end of the current day
				const dayEnd = localizer.endOf(currentStart, "day")

				// Only add segment if it overlaps with the target column
				if(dayEnd >= columnStart && currentStart <= columnEnd) {
					segments.push({
						...event,
						displayStart: currentStart < columnStart ? columnStart : currentStart,
						displayEnd: dayEnd > columnEnd ? columnEnd : dayEnd,
					})
				}

				// Move to start of next day
				currentStart = localizer.add(dayEnd, 1, "day")
				currentStart = localizer.startOf(currentStart, "day")
			}

			// Add final segment if there are remaining hours in the last day
			// and it overlaps with the target column
			if(localizer.isBefore(currentStart, currentEnd) &&
				currentEnd >= columnStart && currentStart <= columnEnd) {
				segments.push({
					...event,
					displayStart: currentStart < columnStart ? columnStart : currentStart,
					displayEnd: currentEnd > columnEnd ? columnEnd : currentEnd,
				})
			}

			return segments
		}

		events.forEach(event => {
			columnHeadings.forEach((heading, columnIndex) => {
				const columnStart = localizer.startOf(heading.date, "day")
				const columnEnd = localizer.endOf(heading.date, "day")

				// Event should appear in this column if it overlaps with the column's day
				if(event.end > columnStart && event.start < columnEnd) {
					const columnEvents = groupedEvents.get(columnIndex) || []

					if(displayStrategy === "split") {
						// Split the event at day boundaries
						const segments = splitAtDayBoundaries(event, columnStart, columnEnd)
						columnEvents.push(...segments)
					} else {
						// For non-split strategies, only show in the column where the event starts
						if(localizer.isSame(event.start, heading.date, "day")) {
							columnEvents.push({
								...event,
								displayStart: event.start,
								displayEnd: event.end,
							})
						}
					}

					groupedEvents.set(columnIndex, columnEvents)
				}
			})
		})

		return groupedEvents
	}, [events, columnHeadings, localizer, displayStrategy])

	const renderedEvents = useMemo(() => {
		const allRenderedEvents: JSX.Element[] = []

		eventsGroupedByColumn.forEach((columnEvents, columnIndex) => {
			columnEvents.forEach((event) => {
				const position = strategy.calculatePosition(
					event,
					columnIndex,
					columnEvents,
					localizer,
					columnHeadings
				)

				const eventColor = event.color || "var(--mantine-primary-color-filled)"
				const contrastingColor = getContrastingColor(eventColor)

				const { column, startRow, span, width, left, zIndex } = position

				allRenderedEvents.push(
					<Box
						key={ `${event.id}-${columnIndex}` }
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
							? event.title({
								start: event.displayStart || event.start,
								end: event.displayEnd || event.end,
							})
							: event.title }
					</Box>
				)
			})
		})

		return allRenderedEvents
	}, [eventsGroupedByColumn, strategy, localizer, columnHeadings, getContrastingColor, onEventClick])

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
