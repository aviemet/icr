import React, { useState, useEffect, useMemo }  from 'react'
import { router } from '@inertiajs/react'
import { Routes } from '@/lib'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'
import {
	Box,
	Button,
	Calendar,
	Date,
	Modal,
} from '@/Components'
import { useModalContext } from '@/Components/Modal'
import ShiftForm from '@/Pages/Shifts/Form'
import { type NavigateAction, type View, type Event } from 'react-big-calendar'
import { useLocation } from '@/lib/hooks'
import { modals } from '@mantine/modals'

interface ScheduleProps {
	client: Schema.Client
	employees: Schema.Employee[]
	shifts: Schema.Shift[]
}

const Schedule = ({ client, employees, shifts }: ScheduleProps) => {
	const handleSelectEvent = (event: Event, e: React.SyntheticEvent<HTMLElement, globalThis.Event>) => {
		modals.open({
			title: 'Event Details',
			children: (
				<>
					<Box>{ event.title }</Box>
					{ event.start && <Box><Date>{ event.start }</Date></Box> }
					{ event.end && <Box><Date>{ event?.end }</Date></Box> }
				</>
			),
		})
	}

	const handleSelectSlot = ({ start }: { start: Date }) => {
	}

	const handleDateChange = (newDate: Date, view: View, action: NavigateAction) => {
		// console.log({ date: params })
	}

	const handleViewChange = (view: View) => {
		// console.log({ view: params })
	}

	const handleRangeChange = (start: Date, end: Date, view: View) => {
		const startDate = dayjs(start).format('DD-MM-YYYY')
		const endDate = dayjs(end).format('DD-MM-YYYY')

		router.get(`/clients/${client.id}/schedule`,
			{ startDate, endDate, view },
			{
				only: ['shifts'],
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	return (
		<>
			<h1>{ client.person.name }</h1>
			<Box>
				<Calendar
					events={ shifts.map(shift => (
						{
							title: shift.title,
							start: new Date(shift.starts_at),
							end: new Date(shift.ends_at),
						}
					)) }
					onSelectEvent={ handleSelectEvent }
					onSelectSlot={ handleSelectSlot }
					onNavigate={ handleDateChange }
					onView={ handleViewChange }
					onRangeChange={ handleRangeChange }
				/>
			</Box>
			{ /* <Modal title="New Shift" open={ modalContext.open } handleClose={ modalContext.close }>
				<ShiftForm
					start={ newShiftStart }
					client={ client }
					employees={ employees }
					onSubmit={ modalContext.close }
				/>
			</Modal> */ }
		</>
	)
}

export default Schedule
