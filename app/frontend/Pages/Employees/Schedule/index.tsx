import { useMemo } from "react"

import {
	Box,
	Calendar,
} from "@/Components"
import { CalendarEventTitleCallback } from "@/Components/Calendar"
import { useShiftTitleFormatter } from "@/lib/hooks/useShiftTitleFormatter"

interface ScheduleProps {
	employee: Schema.EmployeesShow
	schedules: Schema.CalendarEventsEmployee[]
}

const Schedule = ({ employee, schedules }: ScheduleProps) => {
	const formatShiftTitle = useShiftTitleFormatter()

	const processedSchedules = useMemo(() => {
		return schedules?.map(schedule => {
			return {
				id: schedule.id,
				title: ((event) => formatShiftTitle(event, schedule.clients)) satisfies CalendarEventTitleCallback,
				start: schedule.starts_at,
				end: schedule.ends_at,
			}
		}) || []
	}, [schedules, formatShiftTitle])

	return (
		<>
			<h1>{ employee.name }</h1>

			<Box style={ { width: "100%", height: "100%" } }>
				<Calendar
					defaultDate={ new Date() }
					defaultView="month"
					displayStrategy="split"
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
