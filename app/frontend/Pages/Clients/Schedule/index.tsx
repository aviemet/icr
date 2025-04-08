import { modals } from "@mantine/modals"
import { useCallback, useMemo, useState } from "react"

import {
	Box,
	Calendar,
	Group,
} from "@/Components"
import { CalendarEvent, CalendarEventTitleCallback } from "@/Components/Calendar"
import { NAVIGATION_ACTION, VIEW_NAMES, VIEWS } from "@/Components/Calendar/Views"
import EventPopoverContent from "@/Features/Clients/EventPopoverContent"
import { useShiftTitleFormatter } from "@/lib/hooks/useShiftTitleFormatter"
import { useGetClientSchedules } from "@/queries/clients"

import NewShiftForm from "./NewShiftForm"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsClient[]
}

// Add index signature back
interface ScheduleResources {
	[key: string]: object
	employee: Schema.ShiftsClient["employee"]
	client: Schema.ClientsShow
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

	const processedSchedules = useMemo((): CalendarEvent<ScheduleResources>[] => {
		return data?.map(schedule => {
			const start = ensureDate(schedule.starts_at)
			const end = ensureDate(schedule.ends_at)
			const employee = schedule.shift.employee

			return {
				id: schedule.id,
				// Use imported type for title callback
				title: ((event) => formatShiftTitle(event, employee)) satisfies CalendarEventTitleCallback<ScheduleResources>,
				start,
				end,
				color: employee.color,
				resources: { employee, client },
				// Use imported type for satisfies clause
			} satisfies CalendarEvent<ScheduleResources>
		}) || []
	}, [client, data, formatShiftTitle])

	const handleSlotSelect = (date: Date) => {
		modals.open({
			title: "New Shift",
			children: <NewShiftForm client={ client } selectedDate={ date } />,
		})
	}

	return (
		<>
			<Group justify="space-between">
				<h1>{ client?.person?.name }</h1>
				<Box></Box>
			</Group>

			<Calendar<ScheduleResources>
				defaultDate={ new Date() }
				defaultView="month"
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				onSelectSlot={ handleSlotSelect }
				eventPopoverContent={ (event, localizer) => <EventPopoverContent event={ event } localizer={ localizer } /> }
			/>
		</>
	)
}

export default Schedule
