import { isEmpty } from "lodash-es"
import { useCallback, useEffect, useRef } from "react"
import { type UseFormProps } from "use-inertia-form"

import { BaseCalendarEvent, useCalendarContext } from "@/components/Calendar"
import NewShiftForm, { type NewShiftData } from "@/features/Clients/schedule/NewShiftForm"
import { useGetEmployeesAsOptions } from "@/queries/employees"

interface ScheduleResources {
	[key: string]: object
	employee: Partial<Schema.Employee>
	client: Schema.ClientsShow
}

interface NewShiftCalendarPopoverProps {
	client: Schema.ClientsShow
	selectedDate: Date
}

export function NewShiftCalendarPopover({ client, selectedDate }: NewShiftCalendarPopoverProps) {
	const { upsertDraftEvent, patchDraftEvent, removeDraftEvent } = useCalendarContext()
	const draftIdRef = useRef<string>(crypto.randomUUID())
	const { data: employees = [] } = useGetEmployeesAsOptions({ enabled: true })

	const handleFormChange = useCallback((form: UseFormProps<NewShiftData>) => {
		const startsAt = form.data.calendar_event?.starts_at
		const endsAt = form.data.calendar_event?.ends_at
		const employeeId = form.data.calendar_event?.shift?.employee_id

		const draftId = draftIdRef.current
		const patchData: Partial<BaseCalendarEvent<ScheduleResources>> = {}

		if(!isEmpty(startsAt)) {
			patchData.start = new Date(startsAt)
		}

		if(!isEmpty(endsAt)) {
			patchData.end = new Date(endsAt)
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
