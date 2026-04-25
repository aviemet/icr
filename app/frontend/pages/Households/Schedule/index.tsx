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
import { ensureViewName, Routes } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useCalendarScheduleQueryInitialData, useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetHouseholdSchedules } from "@/queries/households"

interface ScheduleProps {
	household: Schema.HouseholdsShow
	schedules: Schema.CalendarEventsHousehold[]
}

type ScheduleResources = Record<string, object> & {
	client?: Schema.ClientsPersisted
	employee?: Schema.EmployeesPersisted
}

function isScheduleResources(resources: EventResources | undefined): resources is ScheduleResources {
	return resources !== undefined && ("client" in resources || "employee" in resources)
}

const Schedule = ({ household, schedules: initialSchedules }: ScheduleProps) => {
	const { t } = useTranslation()

	const formatEventTitle = useEventTitleFormatter()
	const location = useLocation()
	const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

	const [calendarDate, setCalendarDate] = useState<Date>(ensureDate(location.params.get("date")))
	const [calendarView, setCalendarView] = useState<VIEW_NAMES>(ensureViewName(location.params.get("view")))

	const scheduleQueryInitialData = useCalendarScheduleQueryInitialData(
		`households/${household.slug}/schedule`,
		location.params,
		calendarDate,
		calendarView,
		userTimezone,
		initialSchedules,
	)

	const { data } = useGetHouseholdSchedules({
		slug: household.slug,
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
		return data?.map(schedule => {
			const start = ensureDate(schedule.starts_at)
			const end = ensureDate(schedule.ends_at)
			const client = schedule.clients?.[0]
			const employee = schedule.shift?.employee
			const totalClients = schedule.clients?.length ?? 0
			const clientInitial = client?.first_name?.trim()?.[0] || client?.full_name?.trim()?.[0] || client?.name?.trim()?.[0]
			const indicatorLabel = totalClients > 1 ? "+" : (clientInitial ? clientInitial.toUpperCase() : undefined)

			return {
				id: schedule.id,
				title: client ? (client.full_name || client.name) : (schedule.name ?? ""),
				start,
				end,
				allDay: schedule.all_day,
				color: employee?.color,
				indicatorColor: client?.color,
				indicatorLabel,
				resources: { client, employee },
			}
		}) ?? []
	}, [data])

	const breadcrumbs: Breadcrumb[] = [
		{ title: "Households", href: Routes.households() },
		{ title: household.name, href: Routes.household(household.slug) },
		{ title: "Schedule" },
	]

	return (
		<Page title={ `${household.name} Schedule` } breadcrumbs={ breadcrumbs }>
			<Group justify="space-between">
				<Title>{ t("views.households.schedule.title", { name: household.name }) }</Title>
			</Group>

			<Calendar
				defaultDate={ calendarDate }
				defaultView={ calendarView }
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				onViewChange={ handleViewChange }
				defaultTitleBuilder={ (event) => {
					const client = isScheduleResources(event.resources) ? event.resources.client : undefined
					const employee = isScheduleResources(event.resources) ? event.resources.employee : undefined
					return formatEventTitle(event, employee ?? client )
				} }
				popoverContent={ {
					event: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => (
						<EventPopoverContent event={ event } localizer={ localizer } primaryResource="client" />
					),
				} satisfies Partial<PopoverContentMap> }
			/>
		</Page>
	)
}

export default Schedule

