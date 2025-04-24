import { useMemo } from "react"

import {
	Box,
	Calendar,
} from "@/components"
import { BaseCalendarEvent } from "@/components/Calendar"
import useEventTitleFormatter from "@/lib/hooks/useEventTitleFormatter"

interface ScheduleProps {
	employee: Schema.EmployeesShow
	schedules: Schema.CalendarEventsEmployee[]
}

interface ScheduleResources {
	[key: string]: object
	employee: Schema.ShiftsEmployee
}

const Schedule = ({ employee, schedules }: ScheduleProps) => {
	// const formatEventTitle = useEventTitleFormatter()

	// const { data } = useGetEmployeeSchedules({
	// 	slug: client.slug,
	// 	date: datetime.dateUrl(calendarDate),
	// 	view: calendarView,
	// 	timezone: userTimezone,
	// }, {
	// 	initialData: initialSchedules,
	// 	refetchOnWindowFocus: false,
	// })


	// const processedSchedules = useMemo((): BaseCalendarEvent<ScheduleResources>[] => {
	// 	return data?.map(schedule => {
	// 		const start = ensureDate(schedule.starts_at)
	// 		const end = ensureDate(schedule.ends_at)
	// 		const employee = schedule?.shift?.employee

	// 		return {
	// 			id: schedule.id,
	// 			title: schedule.name ?? "",
	// 			titleBuilder: (event) => formatEventTitle(event, schedule.clients),
	// 			start,
	// 			end,
	// 			allDay: schedule.all_day,
	// 			resources: { employee },
	// 		} satisfies BaseCalendarEvent<ScheduleResources>
	// 	}) || []
	// }, [client, data, formatEventTitle])

	return (
		<>
			<h1>{ employee.name }</h1>

			<Box style={ { width: "100%", height: "100%" } }>
				{ /* <Calendar
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
				/> */ }
			</Box>

		</>
	)
}

export default Schedule
