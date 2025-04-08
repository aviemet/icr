import clsx from "clsx"
import { chunk } from "lodash-es"
import { useMemo, useState } from "react"


import { useCalendarContext, Resources } from "@/Components/Calendar"
import { calculateDailyHours } from "@/Components/Calendar/lib/calculateDailyHours"
import {
	BaseViewProps,
	createViewComponent,
	NAVIGATION,
	VIEWS,
} from "@/Components/Calendar/Views"

import DailyTotals from "./components/DailyTotals"
import { DaysHeading } from "./components/DaysHeading"
import { EventWrapper, Event } from "./components/Event"
import * as classes from "./MonthView.css"
import { useDynamicHoverStyles } from "./useDynamicHoverStyles"
import {
	useDisplayStrategy,
	ViewStrategyName,
	GridDisplayProperties,
} from "../../lib/displayStrategies"

interface MonthViewProps<TResources extends Resources> extends BaseViewProps<TResources> {
	showDailyTotals?: boolean
	displayStrategy: ViewStrategyName<"month">
}

const MonthViewComponent = <
	TResources extends Resources
>({ className, style, displayStrategy, showDailyTotals = true, onSelectSlot }: MonthViewProps<TResources>) => {
	const { date, localizer, events } = useCalendarContext<TResources>()

	const eventsByDay = useDisplayStrategy<TResources, "month", GridDisplayProperties>(
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

	return (
		<div
			className={ clsx(classes.monthView, className) }
			style={ style }
		>
			{ /* Inject the split event hover styles */ }
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
							acc.contentCells.push(
								dayEvents.map(({ event, displayProperties }) => {
									if(
										displayProperties.columnStart === undefined || displayProperties.columnSpan === undefined
									) {
										// eslint-disable-next-line no-console
										console.warn("MonthView rendering missing grid properties", event, displayProperties)
										return null
									}

									return (
										<EventWrapper<TResources>
											key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
											displayProperties={ displayProperties }
											event={ event }
											setHoverId={ setHoverId }
										>
											<Event<TResources>
												key={ `${event.id}-${displayProperties.displayStart.toISOString()}` }
												event={ event }
												displayProperties={ displayProperties }
												localizer={ localizer }
												className={ clsx(displayProperties.className) }
											>
												{ typeof event.title === "string" ? event.title : event.title({ start: displayProperties.displayStart, end: displayProperties.displayEnd, allDay: event.allDay, resources: event.resources }) }
											</Event>
										</EventWrapper>
									)
								})
							)
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
						<div className={ clsx(classes.row) } key={ `week_${index}` }>
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
