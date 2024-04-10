import React, { useState, useEffect, useMemo }  from 'react'
import { router } from '@inertiajs/react'
import { Routes } from '@/lib'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'
import {
	Box,
	Button,
	Calendar,
	Modal,
} from '@/Components'
import { useModalContext } from '@/Components/Modal'
import ShiftForm from '@/Pages/Shifts/Form'
import { type NavigateAction, type View } from 'react-big-calendar'
import { useLocation } from '@/lib/hooks'

interface ScheduleProps {
	client: Schema.Client
	employees: Schema.Employee[]
	shifts: Schema.Shift[]
}

const Schedule = ({ client, employees, shifts }: ScheduleProps) => {
	const handleSelect = ({ start }: { start: Date }) => {
	}

	const handleDateChange = (newDate: Date, view: View, action: NavigateAction) => {
		// console.log({ date: params })
	}

	const handleViewChange = (view: View) => {
		// console.log({ view: params })
	}

	const handleRangeChange = (start: Date, end: Date, view: View) => {
		router.get(`/clients/${client.slug}/schedule`,
			{ start, end },
			{
				only: ['shifts'],
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	return (
		<>
			<h1>{ client.full_name }</h1>
			<Box>
				<Calendar
					events={ shifts.map(shift => (
						{
							title: shift.title,
							start: new Date(shift.starts_at!),
							end: new Date(shift.ends_at!),
						}
					)) }
					onSelectEvent={ event => alert(event.title) }
					onSelectSlot={ handleSelect }
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
