import React  from 'react'
import { router } from '@inertiajs/react'
import { formatter, theme } from '@/lib'
// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import dayjs from 'dayjs'
import {
	Box,
	Calendar,
	DateDisplay,
} from '@/Components'
// import ShiftForm from '@/Pages/Shifts/Form'
import { type NavigateAction, type View, type Event } from 'react-big-calendar'
import { modals } from '@mantine/modals'
import useStore from '@/lib/store'

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const { getContrastingColor } = useStore()

	const handleSelectEvent = (event: Event, e: React.SyntheticEvent<HTMLElement, globalThis.Event>) => {
		modals.open({
			title: 'Event Details',
			children: (
				<>
					<Box>{ event.title }</Box>
					{ event.start && <Box><DateDisplay>{ event.start }</DateDisplay></Box> }
					{ event.end && <Box><DateDisplay>{ event?.end }</DateDisplay></Box> }
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
		const name = schedule?.shift?.employee ? schedule.shift.employee.person.name : schedule.name

		return `${start ? start : ''}${end
			? (
				start ?
					` - ${end}`
					: end
			)
			: ''}: ${name}`
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
					events={ schedules.map(schedule => {
						return {
							id: schedule.id,
							title: buildShiftTitle(schedule),
							start: schedule.starts_at,
							end: schedule.ends_at,
							resource: {
								backgroundColor: schedule.shift.employee.color,
							},
						}
					}) }
					onSelectEvent={ handleSelectEvent }
					onSelectSlot={ handleSelectSlot }
					onNavigate={ handleDateChange }
					onView={ handleViewChange }
					onRangeChange={ handleRangeChange }
					eventPropGetter={ eventStyleGetter }
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
