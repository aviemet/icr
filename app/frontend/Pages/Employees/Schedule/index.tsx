import { useMemo } from "react"

import {
	Box,
	Calendar,
} from "@/Components"
import { useShiftTitleFormatter } from "@/lib/hooks/useShiftTitleFormatter"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsShow[]
}

const Schedule = ({ client, schedules }: ScheduleProps) => {
	const formatShiftTitle = useShiftTitleFormatter()

	const processedSchedules = useMemo(() => {
		return schedules?.map(schedule => {
			const employee = schedule.shift.employee

			return {
				id: schedule.id,
				title: formatShiftTitle(schedule, employee),
				start: schedule.starts_at,
				end: schedule.ends_at,
			}
		}) || []
	}, [schedules, formatShiftTitle])

	return (
		<>
			<h1>{ client?.person?.name }</h1>

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
