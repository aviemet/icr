import { router } from "@inertiajs/react"
import { modals } from "@mantine/modals"
import React, { useCallback, useMemo, useRef, useState } from "react"

import {
	Box,
	Calendar,
	Group,
} from "@/Components"
import { DisplayStrategy } from "@/Components/Calendar/Views/Month/displayStrategies"
import { Select } from "@/Components/Inputs"
import { buildShiftTitle, formatEventTitle } from "@/lib"
import { usePageProps } from "@/lib/hooks"
import { initials } from "@/lib/strings"

import NewShiftForm from "./NewShiftForm"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const { settings } = usePageProps()

	const newShiftModalRef = useRef<string>()

	const [displayStrategy, setDisplayStrategy] = useState<DisplayStrategy>("split")

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
		employee: Schema.EmployeesPersisted,
		displayStart?: Date,
		displayEnd?: Date
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
				displayStart || schedule.starts_at,
				displayEnd || schedule.ends_at,
				templateVars
			)
		// eslint-disable-next-line no-unused-vars
		} catch(e) {
			return schedule.name || buildShiftTitle({
				start: displayStart || schedule.starts_at,
				end: displayEnd || schedule.ends_at,
				name: employee.full_name,
			})
		}
	}, [settings.shift_title_format])

	const processedSchedules = useMemo(() => {
		return schedules?.map(schedule => ({
			id: schedule.id,
			title: handleEventTitle(schedule, schedule.shift.employee),
			start: schedule.starts_at,
			end: schedule.ends_at,
			color: schedule.shift.employee.color,
			getTitleWithDisplayTimes: (displayStart?: Date, displayEnd?: Date) =>
				handleEventTitle(schedule, schedule.shift.employee, displayStart, displayEnd),
		})) || []
	}, [schedules, handleEventTitle])

	return (
		<>
			<Group justify="space-between">
				<h1>{ client?.person?.name }</h1>
				<Box>
					<Select
						options={ [
							{ value: "stack", label: "Stack" },
							{ value: "span", label: "Span" },
							{ value: "split", label: "Split" },
						] as { value: DisplayStrategy, label: string }[] }
						value={ displayStrategy }
						onChange={ (value: string | null) => {
							if(value && (value === "stack" || value === "span" || value === "split")) {
								setDisplayStrategy(value)
							}
						} }
					/>
				</Box>
			</Group>
			<Calendar
				defaultDate={ new Date() }
				defaultView="month"
				events={ processedSchedules }
				displayStrategy={ displayStrategy }
				// onSelectEvent={ handleSelectEvent }
				// onSelectSlot={ handleSelectSlot }
				// onNavigate={ handleDateChange }
				// onView={ handleViewChange }
				// onRangeChange={ handleRangeChange }
				// eventPropGetter={ eventStyleGetter }
				// onNewShift={ handleNewShift }
			/>
		</>
	)
}

export default Schedule
