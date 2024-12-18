import React  from 'react'
import { router } from '@inertiajs/react'
import { formatter } from '@/lib'
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'
import {
	Box,
	Calendar,
	Date,
} from '@/Components'
// import ShiftForm from '@/Pages/Shifts/Form'
import { type NavigateAction, type View, type Event } from 'react-big-calendar'
import { modals } from '@mantine/modals'

interface ScheduleProps {
	client: Schema.ClientsShow
	employees: Schema.EmployeesPersisted[]
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, employees, schedules }: ScheduleProps) => {
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

		router.get(`/clients/${client.slug}/schedule`,
			{ startDate, endDate, view },
			{
				only: ['shifts'],
				preserveState: true,
				preserveScroll: true,
			},
		)
	}

	const buildShiftTitle = (schedule: Schema.CalendarEventsShow) => {
		const start = schedule.starts_at ? formatter.time.short(schedule.starts_at) : undefined
		const end = schedule.ends_at ? formatter.time.short(schedule.ends_at) : undefined
		const name = schedule?.employee ? schedule.employee.person.name : schedule.name


		return `${start ? start : ''}${end
			? (
				start ?
					` - ${end}`
					: end
			)
			: ''}: ${name}`
	}

	return (
		<>
			<h1>{ client?.person?.name }</h1>
			<Box>
				<Calendar
					events={ schedules.map(schedule => (
						{
							title: buildShiftTitle(schedule),
							start: schedule.starts_at,
							end: schedule.ends_at,
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
