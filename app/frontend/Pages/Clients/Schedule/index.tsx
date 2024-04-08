import React, { useState, useEffect }  from 'react'
import { router } from '@inertiajs/react'
import { Routes } from '@/lib'
import { Calendar, Views, dayjsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'
import {
	Box,
	Button,
	Modal,
} from '@/Components'
import ShiftForm from '@/Pages/Shifts/Form'

import 'react-big-calendar/lib/css/react-big-calendar.css'

const DragAndDropCalendar = withDragAndDrop(Calendar)

const localizer = dayjsLocalizer(dayjs)

const Schedule = ({ client, employees, shifts }) => {
	const [modalOpen, setModalOpen] = useState(false)
	const [newShiftStart, setNewShiftStart] = useState<Date>(new Date())
	const [initialDay, setInitialDay] = useState<Date>()

	const handleSelect = ({ start }: { start: Date }) => {
		setNewShiftStart(set(start, { hours: 8 }))
		setModalOpen(true)
	}

	const handleDateChange = params => {
		console.log({ date: params })
	}

	const handleViewChange = params => {
		console.log({ view: params })
	}

	const handleRangeChange = params => {
		const start = format(params.start, 'y-MM-dd')
		const end = format(params.end, 'y-MM-dd')
		console.log({ start, end })
		Inertia.get(`/clients/${client.slug}/schedule`,
			{ start, end },
			{
				only: ['shifts'],
				preserveState: true,
				preserveScroll: true,
			}
		)
	}

	const defaultDate = () => {
		const params = new URLSearchParams(window.location.search)
		const start = params.get('start')
		const end = params.get('end')
		if(start && end) {
			const startDate = new Date(start)
			const days = Math.abs(differenceInDays(startDate, new Date(end)))
			const defaultDate = add(startDate, { days: days })
			return defaultDate
		}
	}

	console.log({ shifts })

	return (
		<>
			<h1>{ client.fullast_name }</h1>
			<Box sx={ { backgroundColor: 'white', padding: '10px' } }>
				<DragAndDropCalendar
					selectable
					showAllEvents={ true }
					localizer={ localizer }
					events={ shifts.map(shift => (
						{
							title: shift.title,
							start: new Date(shift.starts_at),
							end: new Date(shift.ends_at)
						}
					)) }
					defaultDate={ defaultDate() }
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
