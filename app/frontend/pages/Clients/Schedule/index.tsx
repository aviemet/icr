import React, { useState }  from 'react'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, add } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { Box, Modal, Typography } from '@mui/material'
import { NewShiftForm } from '@/components'

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

const Schedule = ({ client, employees, shifts }) => {
	const [showModal, setShowModal] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>()
	const [newShiftEnd, setNewShiftEnd] = useState<Date>()

	const handleSelect = ({ start, end }) => {
		setNewShiftStart(start)
		setNewShiftEnd(end)
		setShowModal(true)
	}

	return (
		<>
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
			<Modal
				open={ showModal }
				onClose={ () => setShowModal(false) }
				aria-labelledby="modal-modal-title"
			>
				<Box sx={ {
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					border: '2px solid #000',
					boxShadow: 24,
					p: 4,
				} }>
					<Typography id="modal-modal-title" variant="h6" component="h2">Add New Shift</Typography>
					<NewShiftForm start={ newShiftStart } end={ newShiftEnd } client={ client } employees={ employees } />
				</Box>
			</Modal>
		</>
	)
}

export default Schedule
