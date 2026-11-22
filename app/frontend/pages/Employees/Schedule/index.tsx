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
import { EventPopoverContent } from "@/domains/Clients/EventPopoverContent"
import {
	calendarEventId,
	expandRecurringEvents,
	expansionWindow,
	recurrenceResources,
} from "@/features/CalendarSchedule"
import { ensureViewName, Routes } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useCalendarScheduleQueryInitialData, useLocation } from "@/lib/hooks"
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
	recurrence: ReturnType<typeof recurrenceResources>
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

	const scheduleQueryInitialData = useCalendarScheduleQueryInitialData(
		`employees/${employee.slug}/schedule`,
		location.params,
		calendarDate,
		calendarView,
		userTimezone,
		initialSchedules,
	)

	const { data } = useGetEmployeeSchedules({
		slug: employee.slug,
		date: datetime.dateUrl(calendarDate),
		view: calendarView,
		timezone: userTimezone,
	}, {
		initialData: scheduleQueryInitialData,
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
		if(!data) return []
		const window = expansionWindow(calendarDate, calendarView)
		return expandRecurringEvents(data, window.start, window.end, ({
			master,
			originalOccurrenceStart,
			displayStart,
			displayEnd,
			isRecurring,
		}) => {
			const client = master.clients?.[0]
			const resources: ScheduleResources = {
				recurrence: recurrenceResources(
					master.id,
					originalOccurrenceStart,
					isRecurring,
					master.recurring_patterns ?? [],
				),
			}
			if(client) resources.client = client
			return {
				id: calendarEventId(master.id, originalOccurrenceStart, isRecurring),
				title: client ? (client.full_name || client.name) : (master.name ?? ""),
				start: displayStart,
				end: displayEnd,
				allDay: master.all_day,
				color: client?.color ?? DEFAULT_EVENT_COLOR,
				resources,
			}
		})
	}, [calendarDate, calendarView, data])

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
