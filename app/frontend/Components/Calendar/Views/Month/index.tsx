import clsx from "clsx"
import { chunk } from "lodash-es"
import { CSSProperties, useMemo, useRef, useState } from "react"

import { useCalendarContext, EventResources } from "@/Components/Calendar"
import { calculateDailyHours } from "@/Components/Calendar/lib/calculateDailyHours"
import {
	BaseViewProps,
	createViewComponent,
	NAVIGATION,
	VIEWS,
} from "@/Components/Calendar/Views"

import DailyTotals from "./components/DailyTotals"
import { DaysHeading } from "./components/DaysHeading"
import { EventWrapper, MonthEvent } from "./components/Event"
import * as classes from "./MonthView.css"
import { useDynamicHoverStyles } from "./useDynamicHoverStyles"
import {
	useDisplayStrategy,
	ViewStrategyName,
	GridDisplayProperties,
} from "../../lib/displayStrategies"
import { ShowMore } from "./components/Event/ShowMore"
import { CalendarTransitionContainer } from "../../lib/CalendarTransitionContainer"

interface MonthViewProps<TEventResources extends EventResources> extends BaseViewProps<TEventResources> {
	showDailyTotals?: boolean
	displayStrategy: ViewStrategyName<"month">
}

const MonthViewComponent = <
	TEventResources extends EventResources
>({ className, style, displayStrategy, showDailyTotals = true, onSelectSlot }: MonthViewProps<TEventResources>) => {
	const { date, localizer, events, maxEvents } = useCalendarContext<TEventResources>()

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

	/**
	 *
	 */
	const handleClickBackground = (e: React.MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLElement
		const cell = target.closest<HTMLDivElement>(`.${classes.dateCellBackground}`)

		if(cell && cell.dataset.date && onSelectSlot) {
			const clickedDate = new Date(cell.dataset.date)
			onSelectSlot(clickedDate)
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
					{ weeks.map((week, index) => {
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

							return acc
						}, {
							backgroundCells: [] as React.ReactNode[],
							headingCells: [] as React.ReactNode[],
							contentCells: [] as React.ReactNode[],
							totalCells: [] as React.ReactNode[],
						})

						return (
							<div className={ clsx(classes.row) } key={ `week_${index}` } style={ {
								"--min-rows": numEventsRows,
							} as CSSProperties }>
								<div
									className={ clsx(classes.rowLayerContainer, classes.backgroundLayer) }
									onClick={ handleClickBackground }
								>
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
			</CalendarTransitionContainer>
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
