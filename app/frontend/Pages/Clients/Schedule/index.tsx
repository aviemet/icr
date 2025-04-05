import { useCallback, useMemo, useState } from "react"

import {
	Box,
	Calendar,
	Group,
} from "@/Components"
import { CalendarEventTitleCallback } from "@/Components/Calendar"
import { NAVIGATION_ACTION, VIEW_NAMES, VIEWS } from "@/Components/Calendar/Views"
import { useShiftTitleFormatter } from "@/lib/hooks/useShiftTitleFormatter"
import { useGetClientSchedules } from "@/queries/clients"

// import NewShiftForm from "./NewShiftForm"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsClient[]
}

// Ensure a value is a Date object
const ensureDate = (value: unknown): Date => {
	if(value instanceof Date) return value
	if(typeof value === "string" || typeof value === "number") return new Date(value)
	return new Date() // Fallback
}

const Schedule = ({ client, schedules: initialSchedules }: ScheduleProps) => {
	const formatShiftTitle = useShiftTitleFormatter()

	const [queryParams, setQueryParams] = useState<{ date: Date, view: VIEW_NAMES }>({
		date: new Date(),
		view: VIEWS.month,
	})

	// Use React Query to fetch schedules with the initial data from Inertia
	const { data } = useGetClientSchedules({ slug: client.slug, ...queryParams }, {
		initialData: initialSchedules,
		refetchOnWindowFocus: false,
	})

	const handleNavigate = useCallback((newDate: Date, action: NAVIGATION_ACTION, view: VIEW_NAMES) => {
		setQueryParams({
			date: newDate,
			view: view,
		})
	}, [])

	const processedSchedules = useMemo(() => {
		return data?.map(schedule => {
			// Ensure dates are proper Date objects
			const start = ensureDate(schedule.starts_at)
			const end = ensureDate(schedule.ends_at)

			const employee = schedule.shift.employee

			return {
				id: schedule.id,
				title: ((event) => formatShiftTitle(event, employee)) satisfies CalendarEventTitleCallback,
				start,
				end,
				color: employee.color,
			}
		}) || []
	}, [data, formatShiftTitle])

	return (
		<>
			<Group justify="space-between">
				<h1>{ client?.person?.name }</h1>
				<Box></Box>
			</Group>

			<Calendar
				defaultDate={ new Date() }
				defaultView="month"
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				// onSelectEvent={ handleSelectEvent }
				// onSelectSlot={ handleSelectSlot }
				// onView={ handleViewChange }
				// onRangeChange={ handleRangeChange }
				// eventPropGetter={ eventStyleGetter }
				// onNewShift={ handleNewShift }
			/>
		</>
	)
}

export default Schedule

/* TODO: We'll get to the new shift button eventually
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
	}, [client, handleNewShiftSuccess])
	*/
