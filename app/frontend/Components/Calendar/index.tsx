import clsx from "clsx"
import dayjs from "dayjs"
import React, { useCallback, useMemo, useRef } from "react"
import {
	Calendar,
	DateHeaderProps,
	ToolbarProps,
	Views,
	dayjsLocalizer,
	type CalendarProps,
	type DateLocalizer,
	type Event,
	type View,
} from "react-big-calendar"
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"

import { useLocation } from "@/lib/hooks"

import * as classes from "./Calendar.css"
import DateCellWrapper from "./DateCellWrapper"
import MonthDateHeader from "./MonthDateHeader"
import MonthEvent from "./MonthEvent"
import MonthHeader from "./MonthHeader"
import { NewShiftClick } from "./NewShiftButton"
import Toolbar from "./Toolbar"

const DragAndDropCalendar = withDragAndDrop(Calendar<Event, {}>)

const dayjsLocalizerInstance = dayjsLocalizer(dayjs)

interface CalendarComponentProps
	extends Omit<CalendarProps<Event, {}>, "localizer" | "onRangeChange"> {

	localizer?: DateLocalizer
	onRangeChange?: (start: Date, end: Date, view: View) => void
	onNewShift?: NewShiftClick
	dnd?: boolean
}

const CalendarComponent = ({
	showAllEvents = true,
	localizer = dayjsLocalizerInstance,
	defaultView = Views.MONTH,
	startAccessor = "start",
	endAccessor = "end",
	onRangeChange,
	className,
	onNewShift,
	dnd = false,
	...props
}: CalendarComponentProps) => {
	const { params } = useLocation()

	const startingView = useMemo(() => {
		if(params.has("view")) {
			const view = params.get("view")!.toUpperCase()

			if(view in Views) {
				return Views[view as keyof typeof Views]
			}
		}
		return defaultView
	}, [defaultView, params])

	const viewRef = useRef(startingView)

	/**
	 * Rewrite date range change method to stabilize interface
	 */
	const handleRangeChange = useCallback((range: Date[] | { start: Date, end: Date }, view?: View | undefined) => {
		if(view) viewRef.current = view

		if(!onRangeChange) return

		let start, end
		if(Array.isArray(range)) {
			start = range[0]
			end = range[range.length - 1]
		} else {
			start = range.start
			end = range.end
		}

		onRangeChange(start, end, viewRef.current)
	}, [])

	const components = useMemo(() => ({
		dateCellWrapper: DateCellWrapper,
		toolbar: Toolbar,
		month: {
			dateHeader: (props: DateHeaderProps) => <MonthDateHeader { ...props } onNewShift={ onNewShift } />,
			event: MonthEvent,
			header: MonthHeader,
		},
	}), [])

	const InternalCalendarComponent = dnd
		? DragAndDropCalendar
		: Calendar

	return (
		<InternalCalendarComponent
			selectable
			className={ clsx(classes.darkTheme, classes.calendar, className) }
			showAllEvents={ showAllEvents }
			localizer={ localizer }
			onRangeChange={ handleRangeChange }
			defaultView={ viewRef.current }
			// components={ components }
			{ ...props }
		/>
	)
}

export default React.memo(CalendarComponent)
