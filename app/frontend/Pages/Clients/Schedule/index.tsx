import { modals } from "@mantine/modals"
import { useCallback, useMemo, useState } from "react"

import {
	Box,
	Calendar,
	Group,
} from "@/Components"
import { BaseCalendarEvent } from "@/Components/Calendar"
import { NAVIGATION_ACTION, VIEW_NAMES } from "@/Components/Calendar/Views"
import EventPopoverContent from "@/Features/Clients/EventPopoverContent"
import { ensureViewName } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetClientSchedules } from "@/queries/clients"

import NewShiftForm from "./NewShiftForm"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsClient[]
}

interface ScheduleResources {
	[key: string]: object
	employee: Schema.ShiftsClient["employee"]
	client: Schema.ClientsShow
}

const Schedule = ({ client, schedules: initialSchedules }: ScheduleProps) => {
	const formatEventTitle = useEventTitleFormatter()
	const location = useLocation()
	const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

	const [calendarDate, setCalendarDate] = useState<Date>(ensureDate(location.params.get("date")))
	const [calendarView, setCalendarView] = useState<VIEW_NAMES>(ensureViewName(location.params.get("view")))

	const { data } = useGetClientSchedules({
		slug: client.slug,
		date: datetime.dateUrl(calendarDate),
		view: calendarView,
		timezone: userTimezone,
	}, {
		initialData: initialSchedules,
		refetchOnWindowFocus: false,
	})

	const handleViewChange = useCallback((newView: VIEW_NAMES) => {
		setCalendarView(newView)

		const params = new URLSearchParams(location.params)
		params.set("view", newView)
		window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`)
	}, [location.pathname, location.params])

	const handleNavigate = useCallback((newDate: Date, _action: NAVIGATION_ACTION, view: VIEW_NAMES) => {
		setCalendarDate(newDate)
		setCalendarView(view)

		const params = new URLSearchParams(location.params)
		params.set("date", datetime.dateUrl(newDate))
		params.set("view", view)
		window.history.replaceState({}, "", `${location.pathname}?${params.toString()}`)
	}, [location.pathname, location.params])

	const processedSchedules = useMemo((): BaseCalendarEvent<ScheduleResources>[] => {
		return data?.map(schedule => {
			const start = ensureDate(schedule.starts_at)
			const end = ensureDate(schedule.ends_at)
			const employee = schedule?.shift?.employee

			return {
				id: schedule.id,
				title: schedule.name ?? "",
				titleBuilder: (event) => formatEventTitle(event, employee),
				start,
				end,
				allDay: schedule.all_day,
				color: employee?.color,
				resources: { employee, client },
			} satisfies BaseCalendarEvent<ScheduleResources>
		}) || []
	}, [client, data, formatEventTitle])

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
				defaultDate={ calendarDate }
				defaultView={ calendarView }
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				onViewChange={ handleViewChange }
				onSelectSlot={ handleSlotSelect }
				eventPopoverContent={ (event, localizer) => <EventPopoverContent event={ event } localizer={ localizer } /> }
			/>
		</>
	)
}

export default Schedule
