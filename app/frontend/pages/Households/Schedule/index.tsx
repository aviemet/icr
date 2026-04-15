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
import { EventPopoverContent } from "@/features/Clients/EventPopoverContent"
import { ensureViewName, Routes } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetHouseholdSchedules } from "@/queries/households"

interface ScheduleProps {
	household: Schema.HouseholdsShow
	schedules: Schema.CalendarEventsClient[]
}

type ScheduleResources = Record<string, object> & {
	employee?: Schema.EmployeesPersisted
}

function isScheduleResources(resources: EventResources | undefined): resources is ScheduleResources {
	return resources !== undefined && "employee" in resources
}

const Schedule = ({ household, schedules: initialSchedules }: ScheduleProps) => {
	const { t } = useTranslation()

	const formatEventTitle = useEventTitleFormatter()
	const location = useLocation()
	const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

	const [calendarDate, setCalendarDate] = useState<Date>(ensureDate(location.params.get("date")))
	const [calendarView, setCalendarView] = useState<VIEW_NAMES>(ensureViewName(location.params.get("view")))

	const { data } = useGetHouseholdSchedules({
		slug: household.slug,
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
			const employee = schedule.shift?.employee

			return {
				id: schedule.id,
				title: schedule.name ?? "",
				start,
				end,
				allDay: schedule.all_day,
				color: employee?.color,
				resources: { employee },
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
					const employee = isScheduleResources(event.resources) ? event.resources.employee : undefined
					return formatEventTitle(event, employee)
				} }
				popoverContent={ {
					event: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => (
						<EventPopoverContent event={ event } localizer={ localizer } primaryResource="employee" />
					),
				} satisfies Partial<PopoverContentMap> }
			/>
		</Page>
	)
}

export default Schedule

