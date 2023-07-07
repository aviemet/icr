import React, { useState }  from 'react'
import { set } from 'date-fns'
import {
	Box,
	Heading,
	ShiftCalendar,
	NewShiftForm,
} from '@/Components'
import { ModalPrompt } from '@/Components/Modal'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const Schedule = ({ client, employees, shifts, dateRange }) => {
	const [formModalOpen, setFormModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>(new Date())

	const handleSelect = ({ start }: { start: Date }) => {
		setNewShiftStart(set(start, { hours: 8 }))
		setFormModalOpen(true)
	}

	return (
		<>
			<Heading>{ client.full_name }</Heading>
			<Box sx={ { padding: '10px' } }>
				<ShiftCalendar
					shifts={ shifts }
					onSelectEvent={ shift => console.log({ shift }) }
					onSelectSlot={ handleSelect }
				/>
			</Box>
			<ModalPrompt title="New Shift" open={ formModalOpen } handleClose={ () => setFormModalOpen(false) }>
				<NewShiftForm
					start={ newShiftStart }
					client={ client }
					employees={ employees }
					onSubmit={ () => setFormModalOpen(false) }
				/>
			</ModalPrompt>
		</>
	)
}

export default Schedule
