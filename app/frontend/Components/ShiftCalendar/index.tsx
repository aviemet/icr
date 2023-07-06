import React, { useMemo, useState } from 'react'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, set, add, differenceInDays, endOfDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Calendar as TuiCalendar } from '@/Components'
import { SegmentedControl } from '@mantine/core'
import dayjs from 'dayjs'

type CalendarView = 'month' | 'week' | 'day'

const calendars = [
	{
		id: '0',
		name: 'Private',
		backgroundColor: '#FF3333',
		borderColor: '#FF3333',
	},
	{
		id: '1',
		name: 'Company',
		backgroundColor: '3333FF',
		borderColor: '3333FF',
	},
]

// import 'react-big-calendar/lib/css/react-big-calendar.css'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const DragAndDropCalendar = withDragAndDrop(Calendar)

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales: {
		'en-US': enUS,
	}
})

const getDateRange = data => {
	let start, end

	if(Array.isArray(data)) {
		start = data[0]
		if(data.length > 1) {
			end = data[data.length - 1]
		} else {
			end = data[0]
		}
	} else if(typeof data === 'object') {
		start = data.start
		end = data.end
	}
	end = endOfDay(end)
	return { start, end }
}

const ShiftCalendar = ({ shifts, onSelectEvent, onSelectSlot, onNavigate, onView, onRangeChange }) => {
	const searchParams = new URLSearchParams(window.location.search)

	const handleSelectEvent = data => {
		if(onSelectEvent) onSelectEvent(data)
	}

	const handleSelectSlot = data => {
		if(onSelectSlot) onSelectSlot(data)
	}

	const handleNavigate = data => {
		if(onNavigate) onNavigate(data)
	}

	const handleView = data => {
		if(onView) onView(data)
	}

	const handleRangeChange = data => {
		const { start, end } = data

		if(onRangeChange) onRangeChange(data, start, end)
	}

	const defaultDate = () => {
		const start = searchParams.get('start')
		const end = searchParams.get('end')

		if(start && end) {
			const startDate = new Date(start)
			const days = Math.abs(differenceInDays(startDate, new Date(end))) / 2
			const defaultDate = add(startDate, { days: days })
			return defaultDate
		}
	}

	const [calendarView, setCalendarView] = useState<CalendarView>('month')

	return (
		<>
			<SegmentedControl
				data={ [
					{ label: 'Day', value: 'day' },
					{ label: 'Week', value: 'week' },
					{ label: 'Month', value: 'month' },
				] }
				value={ calendarView }
				onChange={ (value:CalendarView) => setCalendarView(value) }
			/>
			<TuiCalendar
				view={ calendarView }
				events={ shifts.map(shift => ({ ...shift, calendarId: 0 })) }
				usageStatistics={ false }
				calendars={ calendars }
			/>
			{ /* <DragAndDropCalendar
				selectable
				showAllEvents={ true }
				localizer={ localizer }
				events={ shifts }
				defaultDate={ defaultDate() }
				startAccessor="starts_at"
				endAccessor="ends_at"
				style={ { height: '100vh' } }
				onSelectEvent={ handleSelectEvent }
				onSelectSlot={ handleSelectSlot }
				onNavigate={ handleNavigate }
				onView={ handleView }
				onRangeChange={ handleRangeChange }
			/> */ }
		</>
	)
}

export default ShiftCalendar
