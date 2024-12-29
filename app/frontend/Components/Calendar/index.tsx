import React, { useMemo, useRef } from 'react'
import {
	Calendar,
	DateHeaderProps,
	Views,
	dayjsLocalizer,
	type CalendarProps,
	type DateLocalizer,
	type Event,
	type View,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'

import cx from 'clsx'
import * as classes from './Calendar.css'
import DateCellWrapper from './DateCellWrapper'
import { useLocation } from '@/lib/hooks'
import MonthDateHeader from './MonthDateHeader'
import MonthEvent from './MonthEvent'
import MonthHeader from './MonthHeader'
import { NewShiftClick } from './NewShiftButton'

const DragAndDropCalendar = withDragAndDrop(Calendar<Event, {}>)

const dayjsLocalizerInstance = dayjsLocalizer(dayjs)

interface CalendarComponentProps
	extends Omit<CalendarProps<Event, {}>, 'localizer' | 'onRangeChange'> {

	localizer?: DateLocalizer
	onRangeChange?: (start: Date, end: Date, view: View) => void
	onNewShift?: NewShiftClick
}

const CalendarComponent = ({
	showAllEvents = true,
	localizer = dayjsLocalizerInstance,
	defaultView = Views.MONTH,
	startAccessor = 'start',
	endAccessor = 'end',
	onRangeChange,
	className,
	onNewShift,
	...props
}: CalendarComponentProps) => {
	const { params } = useLocation()

	const startingView = useMemo(() => {
		if(params.has('view')) {
			const view = params.get('view')!.toUpperCase()

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
			defaultView={ viewRef.current }
			components={ {
				dateCellWrapper: DateCellWrapper,
				month: {
					dateHeader: (props: DateHeaderProps) => <MonthDateHeader { ...props } onNewShift={ onNewShift } />,
					event: MonthEvent,
					header: MonthHeader,
				},
			} }
			{ ...props }
		/>
	)
}

export default CalendarComponent
