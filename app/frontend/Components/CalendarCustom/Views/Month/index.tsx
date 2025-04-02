import clsx from "clsx"
import { chunk } from "lodash-es"
import { useMemo } from "react"

import { CalendarEvent, useCalendarContext } from "@/Components/CalendarCustom"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/CalendarCustom/Views"
import { EventWrapper, Event } from "@/Components/CalendarCustom/Views/Month/Event"

import * as classes from "./MonthView.css"

interface MonthViewProps<TEvent extends CalendarEvent = CalendarEvent> extends BaseViewProps<TEvent> {}

const MonthViewComponent = ({
	className,
	style,
}: MonthViewProps) => {
	const { date, localizer, events } = useCalendarContext()

	const eventsByDay = useMemo(() => {
		return localizer.groupedEventsForPeriod(events, date, VIEWS.month, localizer)
	}, [date, events, localizer])

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
					const { backgroundCells, headingCells, contentCells } = week.reduce((acc, day) => {

						acc.backgroundCells.push(
							<div className={ clsx(classes.dateCellBackground) } key={ day.toISOString() }>
							</div>
						)

						acc.headingCells.push(
							<div className={ clsx(classes.dateCellHeading) } key={ day.toISOString() }>
								{ day.getDate() }
							</div>
						)

						const eventsForDay = eventsByDay.get(day.toISOString())
						acc.contentCells.push(
							eventsForDay && eventsForDay.sort((eventA, eventB) => {
								return localizer.isBefore(eventA.event.start, eventB.event.start) ? - 1 : 1
							}).map(({ event, displayProperties }) => {

								return (
									<EventWrapper
										columnStart={ displayProperties.columnStart }
										columnSpan={ displayProperties.columnSpan }
									>
										<Event
											key={ event.id }
											event={ event }
										>
											{ /* { event.title } */ }
											{ `${localizer.format(event.start, "H:mm M/D")} - ${localizer.format(event.end, "H:mm M/D")}` }
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
