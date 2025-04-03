import clsx from "clsx"
import { chunk } from "lodash-es"
import { useMemo } from "react"

import { CalendarEvent, useCalendarContext } from "@/Components/Calendar"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/Calendar/Views"
import { EventWrapper, Event } from "@/Components/Calendar/Views/Month/Event"

import * as classes from "./MonthView.css"

interface MonthViewProps<TEvent extends CalendarEvent = CalendarEvent> extends BaseViewProps<TEvent> {}

const MonthViewComponent = ({
	className,
	style,
}: MonthViewProps) => {
	const { date, localizer, events } = useCalendarContext()

	// Group all events by their date for efficient lookup when rendering
	const eventsByDay = useMemo(() => {
		return localizer.groupedEventsForPeriod(events, date, VIEWS.month, localizer)
	}, [date, events, localizer])

	// Split the month into weeks for grid layout
	const weekdays = useMemo(() => localizer.weekdays(), [localizer])
	const weeks = useMemo(() => {
		return chunk(localizer.visibleDays(date, VIEWS.month), weekdays.length)
	}, [date, localizer, weekdays.length])

	return (
		<div className={ clsx(classes.monthView, className) } style={ style }>

			<div className={ clsx(classes.daysHeading) }>
				{ weekdays.map(day => (
					<div className={ clsx(classes.columnHeading) } key={ day }>{ day }</div>
				)) }
			</div>

			<div className={ clsx(classes.daysContainer) }>
				{ weeks.map((week, index) => {
					// Reduce over each week as a row to build the week display elements
					const { backgroundCells, headingCells, contentCells } = week.reduce((acc, day) => {
						/**
						 * BACKGROUND LAYER
						 */
						acc.backgroundCells.push(
							<div className={ clsx(classes.dateCellBackground) } key={ day.toISOString() } />
						)

						/**
						 * HEADING LAYER
						 */
						acc.headingCells.push(
							<div className={ clsx(classes.dateCellHeading) } key={ day.toISOString() }>
								{ day.getDate() }
							</div>
						)

						/**
						 * EVENTS LAYER
						 */
						acc.contentCells.push(
							(eventsByDay.get(day.toISOString()) || []).map(({ event, displayProperties }) => {
								// Render each event with its proper column positioning
								// displayProperties contains layout info like how many columns the event spans
								return (
									<EventWrapper
										key={ event.id }
										columnStart={ displayProperties.columnStart }
										columnSpan={ displayProperties.columnSpan }
										event={ event }
									>
										<Event
											key={ event.id }
											className={ clsx({
												filled: !!displayProperties.continues,
												indicator: !displayProperties.continues,
											}) }
											event={ event }
										>
											{ event.title }
											{ /* { `${localizer.format(event.start, "H:mm M/D")} - ${localizer.format(event.end, "H:mm M/D")}` } */ }
										</Event>
									</EventWrapper>
								)
							})
						)

						return acc
					}, {
						backgroundCells: [] as React.ReactNode[],
						headingCells: [] as React.ReactNode[],
						contentCells: [] as React.ReactNode[],
					})

					return (
						<div className={ clsx(classes.row) } key={ `week_${index}` }>

							<div className={ clsx(classes.rowLayerContainer, classes.backgroundLayer) }>
								{ backgroundCells }
							</div>

							<div className={ clsx(classes.rowLayerContainer, classes.headingLayer) }>
								{ headingCells }
							</div>

							<div className={ clsx(classes.rowLayerContainer, classes.contentLayer) }>
								{ contentCells }
							</div>

						</div>
					)
				}) }
			</div>

		</div>
	)
}

export const MonthView = createViewComponent(MonthViewComponent, {
	range: (date, { localizer }) => {
		let start = localizer.firstVisibleDay(date, VIEWS.month)
		let end = localizer.lastVisibleDay(date, VIEWS.month)
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 1, "month")
			case NAVIGATION.next:
				return localizer.add(date, 1, "month")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.monthTitle),
})
