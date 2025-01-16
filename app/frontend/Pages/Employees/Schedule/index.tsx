import React  from "react"
import { router } from "@inertiajs/react"
import { buildShiftTitle, theme } from "@/lib"
import dayjs from "dayjs"
import {
	Box,
	Calendar,
} from "@/Components"
import { type NavigateAction, type View, type Event } from "react-big-calendar"
import { modals } from "@mantine/modals"
import useStore from "@/lib/store"
import ShiftInfo from "./ShiftInfo"

interface ScheduleProps {
	employee: Schema.EmployeesShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ employee, schedules }: ScheduleProps) => {
	const { getContrastingColor } = useStore()

	const handleSelectEvent = (event: Event, e: React.SyntheticEvent<HTMLElement, globalThis.Event>) => {
		modals.open({
			title: event.resource.employee.person.name,
			children: (
				<ShiftInfo event={ event } />
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
		const startDate = dayjs(start).format("DD-MM-YYYY")
		const endDate = dayjs(end).format("DD-MM-YYYY")

		router.get(`/employees/${employee.slug}/schedule`,
			{ startDate, endDate, view },
			{
				only: ["shifts"],
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
			<h1>{ employee?.person?.name }</h1>
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
				/>
			</Box>
		</>
	)
}

export default Schedule
