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
import { recurrenceResources } from "@/features/CalendarSchedule"
import { ensureViewName, Routes, vars } from "@/lib"
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
	recurrence: ReturnType<typeof recurrenceResources>
	shift?: { service_type_id: string, mileage?: string | number | null }
}

const OPEN_SHIFT_COLOR = vars.colors.red[6]

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
		if(!data) return []
		return data.map((event) => {
			const client = event.clients?.[0]
			const employee = event.shift?.employee
			const isOpenShift = employee === undefined || employee === null
			const totalClients = event.clients?.length ?? 0
			const clientInitial = client?.first_name?.trim()?.[0] || client?.full_name?.trim()?.[0] || client?.name?.trim()?.[0]
			const indicatorLabel = totalClients > 1 ? "+" : (clientInitial ? clientInitial.toUpperCase() : undefined)
			const resources: ScheduleResources = {
				recurrence: recurrenceResources(event),
				shift: {
					service_type_id: event.shift?.service_type?.slug ?? event.shift?.service_type_id ?? "",
					mileage: event.shift?.mileage ?? null,
				},
			}
			if(client) resources.client = client
			if(employee) resources.employee = employee

			return {
				id: event.id,
				title: isOpenShift
					? (event.name || "Open shift")
					: (client ? (client.full_name || client.name) : (event.name ?? "")),
				start: ensureDate(event.starts_at),
				end: ensureDate(event.ends_at),
				allDay: event.all_day,
				color: isOpenShift
					? (
						event.shift?.service_type
						&& event.shift.service_type.slug !== "regular"
						&& event.shift.service_type.color
							? event.shift.service_type.color
							: OPEN_SHIFT_COLOR
					)
					: employee?.color,
				open: isOpenShift,
				borderColor: isOpenShift
					&& (
						!event.shift?.service_type
						|| event.shift.service_type.slug === "regular"
						|| !event.shift.service_type.color
					)
					? event.shift?.service_type?.color
					: undefined,
				indicatorColor: client?.color,
				indicatorLabel,
				resources,
			}
		})
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

