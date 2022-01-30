import React from 'react'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, add } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box } from '@mui/material'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const DragAndDropCalendar = withDragAndDrop(Calendar)

type Event = {
	title: string
	start: Date
	end: Date
	allDay?: boolean
	resource?: any
}

const locales = {
	'en-US': enUS,
}

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales,
})

const processShifts = shifts => shifts.map(shift => (
	{
		title: shift.title,
		start: new Date(shift.starts_at),
		end: new Date(shift.ends_at)
	}
))

const Schedule = ({ shifts }) => {
	console.log({ shifts })

	const handleSelect = ({ start, end }) => {
		const title = window.prompt('New Event name')
	}

	return (
		<Box sx={ { backgroundColor: 'white', padding: '10px' } }>
			<DragAndDropCalendar
				selectable
				showAllEvents={ true }
				localizer={ localizer }
				events={ processShifts(shifts) }
				startAccessor="start"
				endAccessor="end"
				style={ { height: '100vh' } }
				onSelectEvent={ event => alert(event.title) }
				onSelectSlot={ handleSelect }
			/>
		</Box>
	)
}

export default Schedule
