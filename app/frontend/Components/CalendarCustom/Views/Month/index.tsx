import clsx from "clsx"
import { chunk } from "lodash-es"
import { useMemo } from "react"

import { useCalendarContext } from "@/Components/CalendarCustom"
import { BaseViewProps } from "@/Components/CalendarCustom/Views"

import * as classes from "./MonthView.css"

interface MonthViewProps extends BaseViewProps {}

const MonthView = ({

}: MonthViewProps) => {
	const { date, localizer, events } = useCalendarContext()

	const weekdays = useMemo(() => localizer.weekdays(), [])
	const weeks = useMemo(() => {
		return chunk(localizer.visibleDays(date), weekdays.length)
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
					// Use reduce instead of map so we only loop over each week once rather than thrice
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

						acc.contentCells.push(
							<div className={ clsx(classes.dateCellContent) } key={ day.toISOString() }>
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
							<div className={ clsx(classes.rowLayerContainer) }>
								{ backgroundCells }
							</div>

							<div className={ clsx(classes.rowLayerContainer) }>
								{ headingCells }
							</div>

							<div className={ clsx(classes.rowLayerContainer, "content") }>
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
