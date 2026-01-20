import clsx from "clsx"
import { chunk } from "lodash-es"
import { CSSProperties, useMemo, useRef, useState } from "react"

import { useCalendarContext, EventResources } from "@/components/Calendar"
import { calculateDailyHours } from "@/components/Calendar/lib/calculateDailyHours"
import {
	BaseViewProps,
	createViewComponent,
	NAVIGATION,
	VIEWS,
} from "@/components/Calendar/views"

import DailyTotals from "./components/DailyTotals"
import { DaysHeading } from "./components/DaysHeading"
import { EventWrapper, MonthEvent } from "./components/Event"
import * as classes from "./MonthView.css"
import { useDynamicHoverStyles } from "./useDynamicHoverStyles"
import {
	useDisplayStrategy,
	GridDisplayProperties,
} from "../../lib/displayStrategies"
import { ShowMore } from "./components/Event/ShowMore"
import { CalendarTransitionContainer } from "../../lib/CalendarTransitionContainer"

interface MonthViewProps<TEventResources extends EventResources> extends BaseViewProps<TEventResources, "month"> {
	showDailyTotals?: boolean
}

const MonthViewComponent = <TEventResources extends EventResources>({
	className,
	style,
	displayStrategy,
	showDailyTotals = true,
}: MonthViewProps<TEventResources>) => {
	const { date, localizer, events, maxEvents, onClick } = useCalendarContext<TEventResources>()

	const eventsByDay = useDisplayStrategy<TEventResources, "month", GridDisplayProperties>(
		VIEWS.month,
		displayStrategy
	)

	const [hoverId, setHoverId] = useState<string>("")
	const dynamicHoverStyles = useDynamicHoverStyles(hoverId)

	// Calculate daily totals once for all days
	const dailyTotals = useMemo(() => {
		return calculateDailyHours(events, localizer)
	}, [events, localizer])

	// Split the month into weeks for grid layout
	const weekdays = useMemo(() => localizer.weekdays(), [localizer])
	const weeks = useMemo(() => {
		return chunk(localizer.visibleDays(date, VIEWS.month), weekdays.length)
	}, [date, localizer, weekdays.length])

	const handleClickBackground = (e: React.MouseEvent<HTMLDivElement>) => {
		if(!(e.target instanceof HTMLElement)) return

		const cell = e.target.closest<HTMLDivElement>(`.${classes.dateCellBackground}`)

		if(cell && cell.dataset.date && onClick) {
			const clickedDate = new Date(cell.dataset.date)
			onClick({ type: "background", date: clickedDate, element: cell })
		}
	}

	// Find the max rows displayed in a week
	let numEventsRows = maxEvents === Infinity ? 0 : maxEvents

	const animationContainerRef = useRef<HTMLDivElement>(null)

	return (
		<div className={ clsx(classes.monthView, className) } style={ style } ref={ animationContainerRef }>
			<style>{ dynamicHoverStyles }</style>

			<CalendarTransitionContainer containerRef={ animationContainerRef }>
				<DaysHeading weekdays={ weekdays } />

				<div className={ clsx(classes.daysContainer) }>

					{ /* Iterate over the weeks in the month to create rows */ }
					{ weeks.map((week, index) => {

						// Iterate over the days in the week for displaying events in date cells
						const { backgroundCells, headingCells, contentCells, totalCells } = week.reduce((acc, day, weekDayIndex) => {
							const dayMapKey = day.toISOString()
							/**
							 * BACKGROUND LAYER
							 */
							acc.backgroundCells.push(
								<div
									key={ dayMapKey }
									className={ clsx(classes.dateCellBackground, {
										[classes.outOfRange]: !localizer.isSame(day, date, "month"),
									}) }
									data-date={ dayMapKey }
								/>
							)

							/**
							 * HEADING LAYER
							 */
							acc.headingCells.push(
								<div
									className={ clsx(classes.dateCellHeading, {
										[classes.dateToday]: localizer.isSame(day, new Date(), "day"),
										[classes.outOfRange]: !localizer.isSame(day, date, "month"),
									}) }
									key={ dayMapKey }
								>
									<span>{ day.getDate() }</span>
								</div>
							)

							/**
							 * EVENTS LAYER
							 */
							const dayEvents = eventsByDay?.get(dayMapKey)

							if(dayEvents) {
								const visibleEvents: JSX.Element[] = []
								const overflowEvents: JSX.Element[] = []

								// Build and sort each event based on maxEvents prop
								dayEvents.forEach(({ event, displayProperties }, dayEventsIndex) => {
									if(
										displayProperties.columnStart === undefined || displayProperties.columnSpan === undefined
									) {
										// eslint-disable-next-line no-console
										console.warn("MonthView rendering missing grid properties", event, displayProperties)
										return null
									}

									const eventComponent = (
										<EventWrapper<TEventResources>
											key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
											displayProperties={ displayProperties }
											event={ event }
											setHoverId={ setHoverId }
										>
											<MonthEvent<TEventResources>
												key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
												event={ event }
												displayProperties={ displayProperties }
												localizer={ localizer }
												className={ clsx(displayProperties.className) }
											>
												{ event.titleBuilder
													? event.titleBuilder({
														start: displayProperties.displayStart,
														end: displayProperties.displayEnd,
														allDay: event.allDay,
														title: event.title,
														resources: event.resources,
													})
													: event.title }
											</MonthEvent>
										</EventWrapper>
									)

									if(dayEventsIndex < maxEvents) { // Build visible events list
										visibleEvents.push(eventComponent)
									} else { // Build overflow events list
										overflowEvents.push(eventComponent)
									}

									if(numEventsRows !== Infinity && numEventsRows < dayEventsIndex) {
										numEventsRows = dayEventsIndex
									}
								})

								// Add show more button to the end of the visible events
								if(overflowEvents.length > 0) {
									visibleEvents.push(
										<ShowMore column={ weekDayIndex + 1 }>
											{ overflowEvents }
										</ShowMore>
									)
								}

								acc.contentCells.push(visibleEvents)
							}

							/**
							 * DAILY TOTALS LAYER
							 */
							if(showDailyTotals) {
								acc.totalCells.push(
									<div key={ `total_${dayMapKey}` } className={ clsx(classes.dateCellFooter) }>
										<DailyTotals dailyMinutesTotal={ dailyTotals.get(dayMapKey) || 0 } />
									</div>
								)
							}

							return acc // reducer iteration return value
						}, {
							backgroundCells: [] as React.ReactNode[],
							headingCells: [] as React.ReactNode[],
							contentCells: [] as React.ReactNode[],
							totalCells: [] as React.ReactNode[],
						}) // Ends reducer

						// week map iteration return value
						// Uses the values built in the reducer to build week rows using 3 (possibly 4) layers
						return (
							<div className={ clsx(classes.row) } key={ `week_${index}` } style={ {
								"--min-rows": numEventsRows,
							} as CSSProperties }>
								<div
									className={ clsx(classes.rowLayerContainer, classes.backgroundLayer) }
									onClick={ handleClickBackground }
								>
									{ /* Visual layer providing structure and background color to the weeks */ }
									{ backgroundCells }
								</div>
								<div className={ clsx(classes.rowLayerContainer, classes.headingLayer) }>
									{ /* Taking up one grid row of the calendar week to display the date cell date */ }
									{ headingCells }
								</div>
								<div className={ clsx(classes.rowLayerContainer, classes.contentLayer) }>
									{ /* CSS-grid container for displaying the events for the week */ }
									{ contentCells }
								</div>
								{ showDailyTotals && (
									<div className={ clsx(classes.rowLayerContainer, classes.footerLayer) }>
										{ /* Optional footer to display the total hours of events in the day */ }
										{ totalCells }
									</div>
								) }
							</div>
						)
					}) }
				</div>
			</CalendarTransitionContainer>
		</div>
	)
}

export const MonthView = createViewComponent<EventResources, "month">(MonthViewComponent, {
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
