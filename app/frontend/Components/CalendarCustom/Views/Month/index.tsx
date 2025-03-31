import clsx from "clsx"
import { chunk } from "lodash-es"
import { useMemo } from "react"

import { useCalendarContext } from "@/Components/CalendarCustom"
import { BaseViewProps, VIEWS } from "@/Components/CalendarCustom/Views"

import * as classes from "./MonthView.css"

interface MonthViewProps extends BaseViewProps {}

const MonthView = ({

}: MonthViewProps) => {
	const { date, localizer, events } = useCalendarContext()

	const eventsByDay = useMemo(() => localizer.groupedEventsForPeriod(events, date, VIEWS.month), [])

	const weekdays = useMemo(() => localizer.weekdays(), [])
	const weeks = useMemo(() => {
		return chunk(localizer.visibleDays(date, VIEWS.month), weekdays.length)
	}, [])

	return (
		<div className={ clsx(classes.monthView) }>

			<div className={ clsx(classes.daysHeading) }>
				{ weekdays.map(day => (
					<div className={ clsx(classes.columnHeader) } key={ day }>{ day }</div>
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
							<div className={ clsx(classes.dateCellContent) } key={ day.toISOString() }>
								{ eventsForDay && eventsForDay.map(event => {
									return (
										<div className={ classes.event } key={ event.id }>{ event.title }</div>
									)
								}) }
							</div>
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

export { MonthView }
