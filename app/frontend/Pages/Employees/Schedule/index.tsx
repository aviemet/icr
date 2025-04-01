import { router } from "@inertiajs/react"
import { modals } from "@mantine/modals"
import { pick } from "lodash-es"
import React, { useCallback, useMemo, useRef } from "react"
import { type NavigateAction, type View, type Event, SlotInfo } from "react-big-calendar"

import {
	Box,
	// Calendar,
} from "@/Components"
import Calendar from "@/Components/CalendarCustom"
import { buildShiftTitle, formatEventTitle, theme } from "@/lib"
import { calendarParams } from "@/lib/dates"
import { usePageProps } from "@/lib/hooks"
import useStore from "@/lib/store"

import ShiftInfo from "./ShiftInfo"


interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const { getContrastingColor } = useStore()
	const { settings } = usePageProps()

	const handleEventTitle = useCallback((
		schedule: Schema.CalendarEventsShow,
		employee: Schema.EmployeesPersisted
	) => {
		try {
			return formatEventTitle(settings.shift_title_format, schedule.starts_at, pick(employee, ["first_name", "last_name", "full_name"]))
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			return schedule.name || buildShiftTitle({
				start: schedule.starts_at,
				end: schedule.ends_at,
				name: employee.full_name,
			})
		}
	}, [])

	const processedSchedules = useMemo(() => {
		return schedules?.map(schedule => {
			return {
				id: schedule.id,
				title: handleEventTitle(schedule, schedule.shift.employee),
				start: schedule.starts_at,
				end: schedule.ends_at,
				resource: {
					backgroundColor: schedule.shift.employee.color,
					employee: schedule.shift.employee,
				},
			}
		}) || []
	}, [schedules, handleEventTitle])

	return (
		<>
			<h1>{ client?.person?.name }</h1>

			<Box style={ { width: "100%", height: "100%" } }>
				<Calendar
					events={ processedSchedules }
					// onSelectEvent={ handleSelectEvent }
					// onSelectSlot={ handleSelectSlot }
					// onNavigate={ handleDateChange }
					// onView={ handleViewChange }
					// onRangeChange={ handleRangeChange }
					// eventPropGetter={ eventStyleGetter }
					// onNewShift={ handleNewShift }
				/>
			</Box>

		</>
	)
}

export default Schedule
