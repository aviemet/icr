import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Box,
	Calendar,
	Group,
} from "@/components"
import { BaseCalendarEvent, EventResources } from "@/components/Calendar"
import { type PopoverContentMap } from "@/components/Calendar/components/CalendarPopover"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { NAVIGATION_ACTION, VIEW_NAMES } from "@/components/Calendar/views"
import EventPopoverContent from "@/features/Clients/EventPopoverContent"
import { NewShiftCalendarPopover } from "@/features/Clients/schedule/NewShiftCalendarPopover"
import { ensureViewName } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetClientSchedules } from "@/queries/clients"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsClient[]
}

interface ScheduleResources {
	[key: string]: object
	employee: Schema.ShiftsClient["employee"]
	client: Schema.ClientsShow
}

function isScheduleResources(resources: EventResources | undefined): resources is ScheduleResources {
	return resources !== undefined && "employee" in resources && "client" in resources
}

const Schedule = ({ client, schedules: initialSchedules }: ScheduleProps) => {
	const { t } = useTranslation()
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
				start,
				end,
				allDay: schedule.all_day,
				color: employee?.color,
				resources: { employee, client },
			} satisfies BaseCalendarEvent<ScheduleResources>
		}) || []
	}, [client, data])

	return (
		<>
			<Group justify="space-between">
				<h1>{ t("views.clients.schedule.title", { name: client?.person?.name }) }</h1>
				<Box></Box>
			</Group>

			<Calendar
				defaultDate={ calendarDate }
				defaultView={ calendarView }
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				onViewChange={ handleViewChange }
				defaultTitleBuilder={ (event) => {
					const employee = isScheduleResources(event.resources) ? event.resources.employee : undefined
					return formatEventTitle(event, employee)
				} }
				popoverContent={ {
					event: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => <EventPopoverContent event={ event } localizer={ localizer } />,
					background: (context) => <NewShiftCalendarPopover client={ client } selectedDate={ context.date } />,
				} satisfies Partial<PopoverContentMap> }
			/>
		</>
	)
}

export default Schedule
