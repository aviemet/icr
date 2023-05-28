import React, { useState, useEffect }  from 'react'
import { Inertia } from '@inertiajs/inertia'
import { Routes } from '@/lib'
import { format, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import {
	Box,
	Button,
	Grid,
	Modal,
	Typography
} from '@mui/material'
import { ShiftCalendar, NewShiftForm, AnimateButton } from '@/Components'
import { ModalPrompt } from '@/Components/Modal'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const Schedule = ({ client, employees, shifts, dateRange }) => {
	const [formModalOpen, setFormModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>(new Date())

	const handleSelect = ({ start }: { start: Date }) => {
		setNewShiftStart(set(start, { hours: 8 }))
		setFormModalOpen(true)
	}

	const handleDateChange = params => {
		console.log({ date: params })
	}

	const handleViewChange = params => {
		console.log({ view: params })
	}

	const handleRangeChange = (params, start, end) => {
		console.log({ range: params, start, end })

		Inertia.get(`/clients/${client.slug}/schedule`,
			{ start, end },
			{
				only: ['shifts'],
				preserveState: true,
				preserveScroll: true,
			}
		)
	}

	console.log({ shifts })

	return (
		<>
			<Typography component="h1" variant="h1">{ client.full_name }</Typography>
			<Box sx={ { backgroundColor: 'white', padding: '10px' } }>
				<ShiftCalendar
					shifts={ shifts }
					onSelectEvent={ shift => console.log({ shift }) }
					onSelectSlot={ handleSelect }
					onNavigate={ handleDateChange }
					onView={ handleViewChange }
					onRangeChange={ handleRangeChange }
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
