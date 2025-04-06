import clsx from "clsx"
import { useMemo } from "react"

import { useCalendarContext, CalendarGenerics } from "@/Components/Calendar"
import TimeGrid from "@/Components/Calendar/components/TimeGrid"
import { BaseViewProps, createViewComponent, NAVIGATION, VIEWS } from "@/Components/Calendar/Views"

import * as classes from "./WeekView.css"

interface WeekViewProps<T extends CalendarGenerics> extends BaseViewProps<T> {
	className?: string
	style?: React.CSSProperties
}

interface DayHeading {
	date: Date
	label: string
}

const WeekViewComponent = ({ className, style }: WeekViewProps<CalendarGenerics>) => {
	const { date, localizer } = useCalendarContext()

	const columnHeadings = useMemo(() => {
		const days = localizer.visibleDays(date, VIEWS.week)
		return days.map(day => ({
			date: day,
			label: localizer.format(day, "ddd, MMM D"),
		}))
	}, [date, localizer])

	return (
		<div className={ clsx(classes.weekView, className) } style={ style }>
			<TimeGrid
				columnHeadings={ columnHeadings }
				startTime={ localizer.startOf(date, "day") }
				endTime={ localizer.endOf(date, "day") }
			/>
		</div>
	)
}

export const WeekView = createViewComponent(WeekViewComponent, {
	range: (date, { localizer }) => {
		let start = localizer.firstVisibleDay(date, VIEWS.week)
		let end = localizer.lastVisibleDay(date, VIEWS.week)
		return { start, end }
	},
	navigate: (date, action, { localizer }) => {
		switch(action) {
			case NAVIGATION.today:
				return new Date()
			case NAVIGATION.previous:
				return localizer.add(date, - 1, "week")
			case NAVIGATION.next:
				return localizer.add(date, 1, "week")
			default:
				return date
		}
	},
	title: (date, { localizer }) => localizer.format(date, localizer.messages.formats.weekTitle),
})
