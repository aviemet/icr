import dayjs from "dayjs"
import { isEmpty } from "lodash-es"
import { useCallback, useEffect, useRef } from "react"

import { BaseCalendarEvent, useCalendarContext } from "@/components/Calendar"
import { EventForm, type EventData } from "@/domains/Clients/schedule/EventForm"
import { useGetEmployeesAsOptions } from "@/queries/employees"

interface ScheduleResources {
	[key: string]: object
	employee: Partial<Schema.Employee>
	client: Schema.ClientsShow
}

interface EventCalendarPopoverProps {
	client: Schema.ClientsShow
	selectedDate: Date
}

export function EventCalendarPopover({ client, selectedDate }: EventCalendarPopoverProps) {
	const { upsertDraftEvent, patchDraftEvent, removeDraftEvent } = useCalendarContext()
	const draftIdRef = useRef<string>(crypto.randomUUID())
	const { data: employees = [] } = useGetEmployeesAsOptions({ enabled: true })

	const handleFormChange = useCallback((data: EventData) => {
		const calendarEvent = data.calendar_event
		const startsAt = calendarEvent?.starts_at
		const endsAt = calendarEvent?.ends_at
		const employeeId = calendarEvent?.shift?.employee_id

		const draftId = draftIdRef.current
		const patchData: Partial<BaseCalendarEvent<ScheduleResources>> = {}

		if(!isEmpty(startsAt)) {
			patchData.start = dayjs(startsAt).toDate()
		}

		if(!isEmpty(endsAt)) {
			patchData.end = dayjs(endsAt).toDate()
		}

		if(employeeId !== undefined) {
			const selectedEmployee = employees.find(employee => String(employee.id) === employeeId)

			if(selectedEmployee) {
				patchData.resources = { employee: selectedEmployee, client }
				patchData.color = selectedEmployee.color || undefined
			}
		}

		if(Object.keys(patchData).length > 0) {
			patchDraftEvent(draftId, patchData)
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
		<EventForm
			client={ client }
			selectedDate={ selectedDate }
			onChange={ handleFormChange }
			onSuccess={ () => {
				removeDraftEvent(draftIdRef.current)
			} }
		/>
	)
}
