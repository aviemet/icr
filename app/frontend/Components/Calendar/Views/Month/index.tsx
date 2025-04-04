import clsx from "clsx"
import { chunk } from "lodash-es"
import { useMemo, useState } from "react"

import { CalendarEvent, useCalendarContext } from "@/Components/Calendar"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/Calendar/Views"

import DailyTotals from "./components/DailyTotals"
import { DaysHeading } from "./components/DaysHeading"
import { EventWrapper, Event } from "./components/Event"
import { groupedEventsForPeriod } from "./displayStrategies"
import * as classes from "./MonthView.css"
import { useDynamicHoverStyles } from "./useDynamicHoverStyles"

interface MonthViewProps<TEvent extends CalendarEvent = CalendarEvent> extends BaseViewProps<TEvent> {
	showDailyTotals?: boolean
}

const MonthViewComponent = ({
	className,
	style,
	displayStrategy = "span",
	showDailyTotals = true,
}: MonthViewProps) => {
	const { date, localizer, events } = useCalendarContext()

	const [hoverId, setHoverId] = useState<string>("")
	const dynamicHoverStyles = useDynamicHoverStyles(hoverId)

	// Group all events by their date for efficient lookup
	const eventsByDay = useMemo(() => {
		return groupedEventsForPeriod(events, date, VIEWS.month, localizer, displayStrategy)
	}, [date, events, localizer, displayStrategy])

	// Split the month into weeks for grid layout
	const weekdays = useMemo(() => localizer.weekdays(), [localizer])
	const weeks = useMemo(() => {
		return chunk(localizer.visibleDays(date, VIEWS.month), weekdays.length)
	}, [date, localizer, weekdays.length])

	return (
		<div
			className={ clsx(classes.monthView, className) }
			style={ style }
		>
			{ /* Inject the dynamic styles */ }
			<style>{ dynamicHoverStyles }</style>

			<DaysHeading weekdays={ weekdays } />

			<div className={ clsx(classes.daysContainer) }>
				{ weeks.map((week, index) => {
					const { backgroundCells, headingCells, contentCells, totalCells } = week.reduce((acc, day) => {
						const dayMapKey = day.toISOString()
						/**
						 * BACKGROUND LAYER
						 */
						acc.backgroundCells.push(
							<div className={ clsx(classes.dateCellBackground) } key={ dayMapKey } />
						)

						/**
						 * HEADING LAYER
						 */
						acc.headingCells.push(
							<div className={ clsx(classes.dateCellHeading) } key={ dayMapKey }>
								{ day.getDate() }
							</div>
						)

						/**
						 * EVENTS LAYER
						 */
						const dayEvents = eventsByDay.get(dayMapKey) || []
						let dailyMinutesTotal = 0

						acc.contentCells.push(
							dayEvents.map(({ event, displayProperties }) => {
								// Calculate daily total as we process each event
								if(showDailyTotals) {
									dailyMinutesTotal += localizer.duration(
										displayProperties.displayStart,
										displayProperties.displayEnd
									)
								}

								return (
									<EventWrapper
										key={ `${event.id}-${displayProperties.displayStart.toISOString() || event.start.toISOString()}` }
										columnStart={ displayProperties.columnStart }
										columnSpan={ displayProperties.columnSpan }
										event={ event }
										setHoverId={ setHoverId }
									>
										<Event
											key={ `${event.id}-${displayProperties.displayStart.toISOString() || event.start.toISOString()}` }
											event={ event }
											displayProperties={ displayProperties }
											localizer={ localizer }
											className={ clsx(displayProperties.className) }
										>
											{ event.title }
										</Event>
									</EventWrapper>
								)
							})
						)

						/**
						 * DAILY TOTALS LAYER
						 */
						if(showDailyTotals) {
							acc.totalCells.push(
								<div key={ `total_${dayMapKey}` } className={ clsx(classes.dateCellFooter) }>
									<DailyTotals dailyMinutesTotal={ dailyMinutesTotal } />
								</div>
							)
						}

						return acc
					}, {
						backgroundCells: [] as React.ReactNode[],
						headingCells: [] as React.ReactNode[],
						contentCells: [] as React.ReactNode[],
						totalCells: [] as React.ReactNode[],
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
							{ showDailyTotals && (
								<div className={ clsx(classes.rowLayerContainer, classes.footerLayer) }>
									{ totalCells }
								</div>
							) }
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
