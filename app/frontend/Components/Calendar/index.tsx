import React, { useRef } from 'react'
import { Calendar, Views, dayjsLocalizer, type CalendarProps, type DateLocalizer, type Event, type View } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'

import cx from 'clsx'
import * as classes from './Calendar.css'

const DragAndDropCalendar = withDragAndDrop(Calendar<Event, {}>)

const dayjsLocalizerInstance = dayjsLocalizer(dayjs)

interface CalendarComponentProps extends Omit<CalendarProps<Event, {}>, 'localizer'|'onRangeChange'> {
	localizer?: DateLocalizer
	onRangeChange?: (start: Date, end: Date, view: View) => void
}

const CalendarComponent = ({
	showAllEvents = true,
	localizer = dayjsLocalizerInstance,
	defaultView = Views.MONTH,
	startAccessor = 'start',
	endAccessor = 'end',
	onRangeChange,
	className,
	...props
}: CalendarComponentProps) => {
	const viewRef = useRef(defaultView)

	const handleRangeChange = (range: Date[] | { start: Date, end: Date }, view?: View | undefined) => {
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
	}

	return (
		<DragAndDropCalendar
			selectable
			className={ cx(classes.calendar, className) }
			showAllEvents={ showAllEvents }
			localizer={ localizer }
			onRangeChange={ handleRangeChange }
			{ ...props }
		/>
	)
}

export default CalendarComponent
