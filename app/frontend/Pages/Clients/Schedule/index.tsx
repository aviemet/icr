import React, { useRef }  from 'react'
import { router } from '@inertiajs/react'
import { buildShiftTitle, formatter, theme } from '@/lib'
import dayjs from 'dayjs'
import {
	Box,
	Calendar,
} from '@/Components'
import { type NavigateAction, type View, type Event } from 'react-big-calendar'
import { modals } from '@mantine/modals'
import useStore from '@/lib/store'
import ShiftInfo from './ShiftInfo'
import NewShiftForm from './NewShiftForm'

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const { getContrastingColor } = useStore()

	const newShiftModalRef = useRef<string>()

	const handleSelectEvent = (event: Event, e: React.SyntheticEvent<HTMLElement, globalThis.Event>) => {
		modals.open({
			title: event.resource.employee.person.name,
			children: (
				<ShiftInfo event={ event } />
			),
		})
	}

	const handleNewShiftSuccess = () => {
		if(!newShiftModalRef.current) return

		modals.close(newShiftModalRef.current)
		router.reload({ only: ['schedules'] })
	}

	const handleNewShift = (date: Date) => {
		newShiftModalRef.current = modals.open({
			title: 'New Shift',
			children: (
				<NewShiftForm
					client={ client }
					selectedDate={ date }
					onSuccess={ handleNewShiftSuccess }
				/>
			),
		})
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

		router.get(`/clients/${client.slug}/schedule`,
			{ startDate, endDate, view },
			{
				only: ['shifts'],
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	const eventStyleGetter = (event: Event) => {
		let defaultColor = theme.colors.blue[5]

		const eventColor = event?.resource?.backgroundColor || defaultColor

		return {
			style: {
				backgroundColor: eventColor,
				color: getContrastingColor(eventColor),
			},
		}
	}

	return (
		<>
			<h1>{ client?.person?.name }</h1>
			<Box>
				<Calendar
					events={ schedules?.map(schedule => {
						return {
							id: schedule.id,
							title:  buildShiftTitle({
								start: schedule.starts_at,
								end: schedule.ends_at,
								name: schedule.shift.employee.person.name,
							}),
							start: schedule.starts_at,
							end: schedule.ends_at,
							resource: {
								backgroundColor: schedule.shift.employee.color,
								employee: schedule.shift.employee,
							},
						}
					}) || [] }
					onSelectEvent={ handleSelectEvent }
					// onSelectSlot={ handleSelectSlot }
					onNavigate={ handleDateChange }
					onView={ handleViewChange }
					onRangeChange={ handleRangeChange }
					eventPropGetter={ eventStyleGetter }
					onNewShift={ handleNewShift }
				/>
			</Box>
		</>
	)
}

export default Schedule
