import { router } from "@inertiajs/react"
import { modals } from "@mantine/modals"
import React, { useCallback, useMemo, useRef } from "react"

import {
	Box,
	Calendar,
} from "@/Components"
import { buildShiftTitle, formatEventTitle, theme } from "@/lib"
import { calendarParams } from "@/lib/dates"
import { usePageProps } from "@/lib/hooks"
import useStore from "@/lib/store"
import { initials } from "@/lib/strings"

import NewShiftForm from "./NewShiftForm"
import ShiftInfo from "./ShiftInfo"


interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const { settings } = usePageProps()

	const newShiftModalRef = useRef<string>()

	const handleNewShiftSuccess = useCallback(() => {
		if(!newShiftModalRef.current) return

		modals.close(newShiftModalRef.current)
		router.reload({ only: ["schedules"] })
	}, [])

	const handleNewShift = useCallback((date: Date) => {
		newShiftModalRef.current = modals.open({
			title: "New Shift",
			children: (
				<NewShiftForm
					client={ client }
					selectedDate={ date }
					onSuccess={ handleNewShiftSuccess }
				/>
			),
		})
	}, [])

	const handleEventTitle = useCallback((
		schedule: Schema.CalendarEventsShow,
		employee: Schema.EmployeesPersisted
	) => {
		try {
			const templateVars = {
				first_name: employee.first_name,
				last_name: employee.last_name,
				full_name: employee.full_name,
				first_initial: initials(employee.first_name),
				last_initial: initials(employee.last_name),
			}
			return formatEventTitle(
				settings.shift_title_format,
				schedule.starts_at,
				schedule.ends_at,
				templateVars
			)
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			return schedule.name || buildShiftTitle({
				start: schedule.starts_at,
				end: schedule.ends_at,
				name: employee.full_name,
			})
		}
	}, [settings.shift_title_format])

	const processedSchedules = useMemo(() => {
		return schedules?.map(schedule => {
			return {
				id: schedule.id,
				title: handleEventTitle(schedule, schedule.shift.employee),
				start: schedule.starts_at,
				end: schedule.ends_at,
				color: schedule.shift.employee.color,
			}
		}) || []
	}, [schedules, handleEventTitle])

	return (
		<>
			<h1>{ client?.person?.name }</h1>

			<Box style={ { width: "100%", height: "1px", minHeight: "90%" } }>
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
