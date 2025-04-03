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

import NewShiftForm from "./NewShiftForm"
import ShiftInfo from "./ShiftInfo"
import { initials } from "../../../lib/strings"


interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const { getContrastingColor } = useStore()
	const { settings } = usePageProps()

	const newShiftModalRef = useRef<string>()

	const handleSelectEvent = useCallback((event: Event, e: React.SyntheticEvent<HTMLElement, globalThis.Event>) => {
		modals.open({
			title: event.resource.employee.person.name,
			children: (
				<ShiftInfo event={ event } />
			),
		})
	}, [])

	const handleSelectSlot = useCallback((info: SlotInfo) => {
		// console.log({ info })
	}, [])

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

	const handleDateChange = useCallback((newDate: Date, view: View, action: NavigateAction) => {
		// console.log("handleDateChange", { newDate, view, action })
	}, [])

	const handleViewChange = useCallback((view: View) => {
		// console.log("handleViewChange", { view })
	}, [])

	const handleRangeChange = useCallback((start: Date, end: Date, view: View) => {
		// console.log("handleRangeChange", { start, end, view })
		router.get(`/clients/${client.slug}/schedule`,
			calendarParams(start, end, view),
			{
				only: ["schedules"],
				preserveState: true,
				preserveScroll: true,
			},
		)
	}, [])

	const eventStyleGetter = useCallback((event: Event) => {
		let defaultColor = theme.colors.blue[5]

		const eventColor = event?.resource?.backgroundColor || defaultColor

		return {
			style: {
				backgroundColor: eventColor,
				color: getContrastingColor(eventColor),
			},
		}
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
