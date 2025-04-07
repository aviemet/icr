import clsx from "clsx"
import { useMemo } from "react"

import { CalendarGenerics, useCalendarContext } from "@/Components/Calendar"
import { CalendarLocalizer } from "@/Components/Calendar/lib/localizers"

import { displayStrategies } from "../../lib/displayStrategies"
import { useDisplayStrategy } from "../../lib/displayStrategies/useDisplayStrategy"
import { VIEWS } from "../../Views"
import { Event } from "./components/Event/Event"
import { EventWrapper } from "./components/Event/EventWrapper"
import Headings from "./components/Headings"
import TimeColumn from "./components/TimeColumn"
import * as classes from "./TimeGrid.css"

export interface TimeGridHeading {
	date: Date
	label: string
}

interface TimeGridProps<T extends CalendarGenerics> {
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

const TimeGrid = <T extends CalendarGenerics>({
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
}: TimeGridProps<T>) => {
	const { localizer, onEventClick } = useCalendarContext()
	const eventsByDay = useDisplayStrategy<T, "week">(VIEWS.week, displayStrategy)

	const timeSlots = useMemo(() => {
		return generateTimeSlots(new Date(startTime), new Date(endTime), timeIncrement, localizer)
	}, [startTime, endTime, timeIncrement, localizer])

	const rowsPerDay = (24 * 60) / timeIncrement

	return (
		<div className={ clsx(classes.timeGrid, className) } style={ {
			"--rows-per-day": rowsPerDay,
			...style,
		} as React.CSSProperties }>
			<div className={ classes.cornerSpacer } />

			<Headings columnHeadings={ columnHeadings } />

			<TimeColumn timeSlots={ timeSlots } />

			<div className={ classes.contentArea }>
				<div className={ classes.contentGrid }>
					<div className={ classes.gridLines } />
					<div className={ classes.eventsContainer }>
						{ columnHeadings.map((heading, columnIndex) => {
							const dayEvents = eventsByDay.get(heading.date.toISOString())
							if(!dayEvents) return null

							return dayEvents.map(({ event, displayProperties }) => {
								const startOfDay = localizer.startOf(displayProperties.displayStart, "day")
								const startMinutes = localizer.duration(displayProperties.displayStart, startOfDay) / (1000 * 60)
								const endMinutes = localizer.duration(displayProperties.displayEnd, startOfDay) / (1000 * 60)

								const startRow = Math.floor(startMinutes / timeIncrement) + 1
								const endRow = Math.ceil(endMinutes / timeIncrement) + 1

								return (
									<EventWrapper
										style={ {
											"--column-start": columnIndex + 1,
											"--grid-row-start": startRow,
											"--grid-row-end": endRow,
										} as React.CSSProperties }
										displayProperties={ displayProperties }
									>
										<Event
											key={ event.id }
											event={ event }
											localizer={ localizer }
											displayProperties={ displayProperties }
											startTime={ startTime }
											timeIncrement={ timeIncrement }
											className={ clsx(displayProperties.className) }
											onEventClick={ onEventClick }
										/>
									</EventWrapper>
								)
							})
						}) }
					</div>
				</div>
			</div>
		</div>
	)
}

export default TimeGrid
