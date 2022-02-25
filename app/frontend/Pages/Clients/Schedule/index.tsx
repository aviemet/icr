import React, { useState, useEffect }  from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Routes, expandRecurringShifts } from '@/lib'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import {
	Box,
	Button,
	Grid,
	Modal,
	Typography
} from '@mui/material'
import { NewShiftForm, AnimateButton } from '@/Components'
import { ModalPrompt } from '@/Components/Modal'

import 'react-big-calendar/lib/css/react-big-calendar.css'

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

const Schedule = ({ client, employees, shifts }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>(new Date())

	const handleSelect = ({ start }: { start: Date }) => {
		setNewShiftStart(set(start, { hours: 8 }))
		setModalOpen(true)
	}

	const handleDateChange = params => {
		console.log({ params })
	}

	const handleViewChange = params => {
		console.log({ params })
	}

	const handleRangeChange = params => {
		console.log({ params })
	}



	return (
		<>
			<h1>{ client.full_name }</h1>
			<Box sx={ { backgroundColor: 'white', padding: '10px' } }>
				<DragAndDropCalendar
					selectable
					showAllEvents={ true }
					localizer={ localizer }
					events={ expandRecurringShifts(shifts).map(shift => (
						{
							title: shift.title,
							start: new Date(shift.starts_at),
							end: new Date(shift.ends_at)
						}
					)) }
					startAccessor="start"
					endAccessor="end"
					style={ { height: '100vh' } }
					onSelectEvent={ event => alert(event.title) }
					onSelectSlot={ handleSelect }
					onNavigate={ handleDateChange }
					onView={ handleViewChange }
					onRangeChange={ handleRangeChange }
				/>
			</Box>
			<ModalPrompt title="New Shift" open={ modalOpen } handleClose={ () => setModalOpen(false) }>
				<NewShiftForm
					start={ newShiftStart }
					client={ client }
					employees={ employees }
					onSubmit={ () => setModalOpen(false) }
				/>
			</ModalPrompt>
		</>
	)
}

export default Schedule
