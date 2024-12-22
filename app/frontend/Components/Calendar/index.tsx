import React, { useRef } from 'react'
import {
	Calendar,
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
import { Box } from '@mantine/core'
import NewShiftButton from './NewShiftButton'

const DragAndDropCalendar = withDragAndDrop(Calendar<Event, {}>)

const dayjsLocalizerInstance = dayjsLocalizer(dayjs)

interface CalendarComponentProps extends Omit<CalendarProps<Event, {}>, 'localizer' | 'onRangeChange'> {
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
	console.log({ props })
	return (
		<DragAndDropCalendar
			selectable
			className={ cx(classes.calendar, className) }
			showAllEvents={ showAllEvents }
			localizer={ localizer }
			onRangeChange={ handleRangeChange }
			components={ {
				// dateCellWrapper: DateCellWrapper,
				// agenda: ({ children }) => {
				// 	console.log({ children })
				// 	return <>{ children }</>
				// },
				// day: ({ children }) => {
				// 	console.log({ children })
				// 	return <>hi{ children }</>
				// },
				// dayColumnWrapper: ({ children }) => {
				// 	console.log({ children })
				// 	return <>{ children }</>
				// },
				// event: (props) => {
				// 	console.log({ props })
				// 	return <></>
				// },
				// eventContainerWrapper: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				// eventWrapper: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				// header: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				month: {
					dateHeader: ({ date, drilldownView, isOffRange, label, onDrillDown }) => {
						const dayOfWeek = date.getDay()

						return <>
							<NewShiftButton />
							<Box component="span">
								{ label }
							</Box>
						</>
					},

				},
				// resourceHeader: ({ children }) => {
				// 	console.log({ children })
				// 	return <>HI{ children }</>
				// },
				// showMore: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				// timeGutterHeader: ({ children }) => {
				// 	console.log({ children })
				// 	return <>{ children }</>
				// },
				// timeGutterWrapper: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				// timeSlotWrapper: ({ children }) => {
				// 	console.log({ children })
				// 	return <>{ children }</>
				// },
				// toolbar: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				// week: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
				// work_week: ({ children }) => {
				//console.log({ children})
				// return <>{ children }</>
				// },
			} }
			{ ...props }
		/>
	)
}

export default CalendarComponent
