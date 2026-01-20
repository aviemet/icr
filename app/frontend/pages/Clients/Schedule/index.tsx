import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { type UseFormProps } from "use-inertia-form"

import {
	Box,
	Calendar,
	Group,
} from "@/components"
import { BaseCalendarEvent, useCalendarContext } from "@/components/Calendar"
import { type PopoverContentMap } from "@/components/Calendar/components/CalendarPopover"
import { CalendarLocalizer } from "@/components/Calendar/lib/localizers"
import { NAVIGATION_ACTION, VIEW_NAMES } from "@/components/Calendar/views"
import EventPopoverContent from "@/features/Clients/EventPopoverContent"
import { ensureViewName } from "@/lib"
import { ensureDate } from "@/lib/dates"
import { datetime } from "@/lib/formatters"
import { useLocation } from "@/lib/hooks"
import { useEventTitleFormatter } from "@/lib/hooks/useEventTitleFormatter"
import { useGetClientSchedules } from "@/queries/clients"
import { useGetEmployeesAsOptions } from "@/queries/employees"

import NewShiftForm, { type NewShiftData } from "./NewShiftForm"

interface ScheduleProps {
	client: Schema.ClientsShow
	schedules: Schema.CalendarEventsClient[]
}

interface ScheduleResources {
	[key: string]: object
	employee: Schema.ShiftsClient["employee"]
	client: Schema.ClientsShow
}

interface DraftNewShiftPopoverContentProps {
	client: Schema.ClientsShow
	selectedDate: Date
}

const DraftNewShiftPopoverContent = ({ client, selectedDate }: DraftNewShiftPopoverContentProps) => {
	const { upsertDraftEvent, patchDraftEvent, removeDraftEvent } = useCalendarContext()
	const draftIdRef = useRef<string>(crypto.randomUUID())
	const { data: employees = [] } = useGetEmployeesAsOptions({ enabled: true })

	const handleFormChange = useCallback((form: UseFormProps<NewShiftData>) => {
		const startsAt = form.data.calendar_event?.starts_at
		const endsAt = form.data.calendar_event?.ends_at
		const employeeId = form.data.calendar_event?.shift?.employee_id

		const draftId = draftIdRef.current

		if(startsAt instanceof Date) {
			patchDraftEvent(draftId, { start: startsAt })
		}
		if(endsAt instanceof Date) {
			patchDraftEvent(draftId, { end: endsAt })
		}

		if(typeof employeeId === "string" && employeeId.length > 0) {
			const selectedEmployee = employees.find(employee => String(employee.id) === employeeId)
			if(selectedEmployee) {
				patchDraftEvent(draftId, {
					resources: { employee: selectedEmployee as unknown as Schema.ShiftsClient["employee"], client },
				})
			}
		}
	}, [client, employees, patchDraftEvent])

	useEffect(() => {
		const draftId = draftIdRef.current

		upsertDraftEvent({
			id: draftId,
			title: "New shift",
			start: selectedDate,
			end: selectedDate,
			allDay: false,
			resources: { client },
		})

		return () => {
			removeDraftEvent(draftId)
		}
	}, [client, removeDraftEvent, selectedDate, upsertDraftEvent])

	return (
		<NewShiftForm
			client={ client }
			selectedDate={ selectedDate }
			onChange={ handleFormChange }
			onSuccess={ () => {
				removeDraftEvent(draftIdRef.current)
			} }
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
				defaultTitleBuilder={ (event: BaseCalendarEvent<ScheduleResources>) => formatEventTitle(event, event.resources?.employee) }
				popoverContent={ {
					event: (event: BaseCalendarEvent, localizer: CalendarLocalizer) => <EventPopoverContent event={ event } localizer={ localizer } />,
					background: (context) => <DraftNewShiftPopoverContent client={ client } selectedDate={ context.date } />,
				} satisfies Partial<PopoverContentMap> }
			/>
		</>
	)
}

export default Schedule
