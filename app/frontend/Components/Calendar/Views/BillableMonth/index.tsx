import React from "react"
import { Views, type Event, type DateCellWrapperProps, type ViewProps } from "react-big-calendar"
import Month from "react-big-calendar/lib/Month"
import dayjs from "dayjs"
import { Box, Text } from "@/Components"
import CustomDateCellWrapper from "./DateCellWrapper"

// Create a custom Month view that extends the default Month view
class CustomMonthView extends Month {
	renderWeek = (week: Date[], weekIdx: number) => {
		const { events = [] } = this.props as ViewProps
		const weekGrid = super.renderWeek(week, weekIdx)

		return React.cloneElement(weekGrid, {
			dateCellWrapper: (props: DateCellWrapperProps) => (
				<CustomDateCellWrapper { ...props } events={ events } />
			),
		})
	}
}

CustomMonthView.title = (start, options) => {
	let end = options.localizer.add(start, options.length, "month")
	return options.localizer.format({ start, end }, "agendaHeaderFormat")
}

CustomMonthView.range = (start, options) => {
	let end = options.localizer.add(start, options.length, "month")
	return { start, end }
}

export default CustomMonthView
