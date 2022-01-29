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

const events = [
	{
		title: 'A thing',
		start: new Date(),
		end: add(new Date(), { hours: 1 }),
	},
	{
		title: 'More things',
		start: add(new Date(), { hours: 1 }),
		end: add(new Date(), { hours: 2 }),
	},
	{
		title: 'Things again',
		start: add(new Date(), { hours: 2 }),
		end: add(new Date(), { hours: 3 }),
	},
	{
		title: 'Something else',
		start: add(new Date(), { hours: 3 }),
		end: add(new Date(), { hours: 4 }),
	},
	{
		title: 'And Again',
		start: add(new Date(), { hours: 4 }),
		end: add(new Date(), { hours: 5 }),
	}
]


const Schedule = props => {


	const handleSelect = ({ start, end }) => {
		const title = window.prompt('New Event name')
	}

	return (
		<Box sx={ { backgroundColor: 'white', padding: '10px' } }>
			<DragAndDropCalendar
				selectable
				showAllEvents={ true }
				localizer={ localizer }
				events={ events }
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
