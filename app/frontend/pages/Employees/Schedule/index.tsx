import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Calendar,
	Group,
	Page,
	Title,
} from "@/components"
import { Breadcrumb } from "@/components/Breadcrumbs"
import { BaseCalendarEvent, EventResources } from "@/components/Calendar"
import { type PopoverContentMap } from "@/components/Calendar/components/CalendarPopover"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { NAVIGATION_ACTION, VIEW_NAMES } from "@/components/Calendar/views"
import EventPopoverContent from "@/features/Clients/EventPopoverContent"
import { ensureViewName, Routes } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetEmployeeSchedules } from "@/queries/employees"

interface ScheduleProps {
	employee: Schema.EmployeesShow
	schedules: Schema.CalendarEventsEmployee[]
}

const DEFAULT_EVENT_COLOR = "#94a3b8"

type ScheduleResources = Record<string, object> & {
	employee?: Schema.EmployeesPersisted
	client?: Schema.ClientsPersisted
}

function isScheduleResources(resources: EventResources | undefined): resources is ScheduleResources {
	return resources !== undefined && "client" in resources
}

const Schedule = ({ employee, schedules: initialSchedules }: ScheduleProps) => {
	const { t } = useTranslation()

	const formatEventTitle = useEventTitleFormatter()
	const location = useLocation()
	const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

	const [calendarDate, setCalendarDate] = useState<Date>(ensureDate(location.params.get("date")))
	const [calendarView, setCalendarView] = useState<VIEW_NAMES>(ensureViewName(location.params.get("view")))

	const { data } = useGetEmployeeSchedules({
		slug: employee.slug,
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
			const client = schedule.clients?.[0]
			const color = client?.color ?? DEFAULT_EVENT_COLOR
			const title = client ? (client.full_name || client.name) : (schedule.name ?? "")

			const resources: ScheduleResources = {}
			if(client) resources.client = client
			return {
				id: schedule.id,
				title,
				start,
				end,
				allDay: schedule.all_day,
				color,
				resources,
			}
		}) ?? []
	}, [data])

	const breadcrumbs: Breadcrumb[] = [
		{ title: "Employees", href: Routes.employees() },
		{ title: employee.full_name, href: Routes.employee(employee.slug) },
		{ title: "Schedule" },
	]

	return (
		<Page title={ `${employee.full_name} Schedule` } breadcrumbs={ breadcrumbs }>
			<Group justify="space-between">
				<Title>{ t("views.employees.schedule.title", { name: employee?.name }) }</Title>
			</Group>

			<Calendar
				defaultDate={ calendarDate }
				defaultView={ calendarView }
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				onViewChange={ handleViewChange }
				defaultTitleBuilder={ (event) => {
					const client = isScheduleResources(event.resources) ? event.resources.client : undefined
					return formatEventTitle(event, client)
				} }
				popoverContent={ {
					event: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => <EventPopoverContent event={ event } localizer={ localizer } primaryResource="client" />,
				} satisfies Partial<PopoverContentMap> }
			/>
		</Page>
	)
}

export default Schedule
