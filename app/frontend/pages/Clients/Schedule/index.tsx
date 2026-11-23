import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Box,
	Button,
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
import { PlusIcon } from "@/components/Icons"
import { Modal, useModalContext } from "@/components/Modal"
import { EventPopoverContent } from "@/domains/Clients/EventPopoverContent"
import { EventForm } from "@/domains/Clients/schedule/EventForm"
import { EventCalendarPopover } from "@/domains/Clients/schedule/NewEventCalendarPopover"
import { recurrenceResources } from "@/features/CalendarSchedule"
import { ensureViewName, Routes, vars } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useCalendarScheduleQueryInitialData, useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetClientSchedules } from "@/queries/clients"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsClient[]
}

interface ScheduleResources {
	[key: string]: object
	employee: NonNullable<Schema.ShiftsClient["employee"]> | Record<string, never>
	client: Schema.ClientsShow
	recurrence: ReturnType<typeof recurrenceResources>
	shift: { service_type_id: string }
}

const OPEN_SHIFT_COLOR = vars.colors.red[6]

function isScheduleResources(resources: EventResources | undefined): resources is ScheduleResources {
	return resources !== undefined && "employee" in resources && "client" in resources
}

function hasAssignedEmployee(employee: Schema.ShiftsClient["employee"] | undefined | null): employee is NonNullable<Schema.ShiftsClient["employee"]> {
	return employee !== undefined && employee !== null && typeof employee.id === "string"
}

function NewEventModalContent({ client }: { client: Schema.ClientsShow }) {
	const { close } = useModalContext()
	return (
		<EventForm
			client={ client }
			onSuccess={ () => close() }
		/>
	)
}

const Schedule = ({ client, schedules: initialSchedules }: ScheduleProps) => {
	const { t } = useTranslation()

	const formatEventTitle = useEventTitleFormatter()
	const location = useLocation()
	const userTimezone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, [])

	const [calendarDate, setCalendarDate] = useState<Date>(ensureDate(location.params.get("date")))
	const [calendarView, setCalendarView] = useState<VIEW_NAMES>(ensureViewName(location.params.get("view")))

	const scheduleQueryInitialData = useCalendarScheduleQueryInitialData(
		`clients/${client.slug}/schedule`,
		location.params,
		calendarDate,
		calendarView,
		userTimezone,
		initialSchedules,
	)

	const { data } = useGetClientSchedules({
		slug: client.slug,
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
			const employee = event.shift?.employee
			const isOpenShift = !hasAssignedEmployee(employee)
			return {
				id: event.id,
				title: isOpenShift ? (event.name || "Open shift") : (event.name ?? ""),
				start: ensureDate(event.starts_at),
				end: ensureDate(event.ends_at),
				allDay: event.all_day,
				color: isOpenShift ? OPEN_SHIFT_COLOR : employee?.color,
				open: isOpenShift,
				borderColor: isOpenShift ? event.shift?.service_type?.color : undefined,
				resources: {
					employee: hasAssignedEmployee(employee) ? employee : {},
					client,
					recurrence: recurrenceResources(event),
					shift: {
						service_type_id: event.shift?.service_type?.slug ?? event.shift?.service_type_id ?? "",
					},
				},
			}
		})
	}, [client, data])

	const breadcrumbs: Breadcrumb[] = [
		{ title: "Clients", href: Routes.clients() },
		{ title: client.full_name, href: Routes.client(client.slug) },
		{ title: "Schedule" },
	]

	return (
		<Page title={ `${client.full_name} Schedule` } breadcrumbs={ breadcrumbs }>
			<Group justify="space-between">
				<Title>{ t("views.clients.schedule.title", { name: client?.person?.name }) }</Title>
				<Box>
					<Modal
						trigger={
							<Button leftSection={ <PlusIcon /> }>
								New Event
							</Button>
						}
						title="New Event"
					>
						<NewEventModalContent client={ client } />
					</Modal>
				</Box>
			</Group>

			<Calendar
				defaultDate={ calendarDate }
				defaultView={ calendarView }
				events={ processedSchedules }
				onNavigate={ handleNavigate }
				onViewChange={ handleViewChange }
				defaultTitleBuilder={ (event) => {
					if(event.open === true) {
						return event.title || "Open shift"
					}
					const resources = isScheduleResources(event.resources) ? event.resources : undefined
					const employee = resources?.employee
					if(employee && "id" in employee && typeof employee.id === "string") {
						return formatEventTitle(event, employee)
					}
					return formatEventTitle(event)
				} }
				popoverContent={ {
					event: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => <EventPopoverContent event={ event } localizer={ localizer } />,
					background: (context) => <EventCalendarPopover client={ client } selectedDate={ context.time ?? context.date } />,
				} satisfies Partial<PopoverContentMap> }
			/>
		</Page>
	)
}

export default Schedule
