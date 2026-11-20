import dayjs from "dayjs"
import { omit } from "es-toolkit"
import { useMemo, useState } from "react"

import { Box, Button, Grid, Group } from "@/components"
import { BaseCalendarEvent } from "@/components/Calendar"
import { Form, Submit, FormConsumer, type FormConsumerState } from "@/components/Form"
import { TextInput, SplitDateTimeInput } from "@/components/Inputs"
import { CategoriesDropdown, EmployeesDropdown } from "@/components/Inputs/Dropdowns"
import { categorySlug, isSystemCategorySlug, isNonEmptyString } from "@/lib"
import { type SystemCategorySlugsFor } from "@/lib/categories"
import { nearestHalfHour } from "@/lib/dates"
import { type CalendarEventData } from "@/queries/calendarEvents"
import { useCreateClientCalendarEvent, useUpdateClientCalendarEvent } from "@/queries/clients"

import { EventTotalHours } from "./EventTotalHours"

const CALENDAR_EVENT_SHIFT = categorySlug("Calendar::Event", "Shift")
const CALENDAR_EVENT_OTHER = categorySlug("Calendar::Event", "Other")

export type EventData = CalendarEventData

function isEventData(value: Record<string, unknown>): value is EventData {
	if(!Object.prototype.hasOwnProperty.call(value, "calendar_event")) return false
	const calendarEvent = value.calendar_event
	if(typeof calendarEvent !== "object" || calendarEvent === null) return false
	return true
}

function getEmployeeIdFromResources(resources: BaseCalendarEvent["resources"]): string {
	if(typeof resources !== "object" || resources === null || !("employee" in resources)) return ""
	const employee = (resources as { employee?: { id?: string } }).employee
	return typeof employee?.id === "string" ? employee.id : ""
}

interface ClientEventFormProps {
	client: Schema.ClientsPersisted
	event?: BaseCalendarEvent
	selectedDate?: Date
	onSuccess?: () => void
	onError?: () => void
	onChange?: (data: EventData) => void
	onCancel?: () => void
}

export function EventForm({
	client,
	event: existingEvent,
	selectedDate = nearestHalfHour(),
	onSuccess,
	onError,
	onChange,
	onCancel,
}: ClientEventFormProps) {
	const isEdit = existingEvent !== undefined
	const [eventType, setEventType] = useState<SystemCategorySlugsFor<"Calendar::Event">>(CALENDAR_EVENT_SHIFT)
	const createEvent = useCreateClientCalendarEvent({ params: { slug: client.slug } })
	const updateEvent = useUpdateClientCalendarEvent({
		params: { slug: client.slug, id: existingEvent ? String(existingEvent.id) : "" },
	})

	const initialData = useMemo<EventData>(() => {
		const baseParticipants = [
			{ participant_type: "Client", participant_id: client.id },
		]
		if(isEdit && existingEvent) {
			const employeeId = getEmployeeIdFromResources(existingEvent.resources)
			return {
				calendar_event: {
					id: String(existingEvent.id),
					category_slug: CALENDAR_EVENT_SHIFT,
					name: existingEvent.title,
					all_day: existingEvent.allDay ?? false,
					starts_at: dayjs(existingEvent.start).toISOString(),
					ends_at: dayjs(existingEvent.end).toISOString(),
					shift: { employee_id: employeeId },
					event_participants: baseParticipants,
				},
			}
		}
		const start = selectedDate
		return {
			calendar_event: {
				category_slug: CALENDAR_EVENT_SHIFT,
				starts_at: dayjs(start).toISOString(),
				ends_at: dayjs(start).add(8, "hours").toISOString(),
				shift: { employee_id: "" },
				event_participants: baseParticipants,
			},
		}
	}, [client.id, existingEvent, isEdit, selectedDate])

	const handleChange = (state: FormConsumerState) => {
		const raw = state.getFormData()
		if(!isEventData(raw)) return
		const data = raw
		const slug = data.calendar_event.category_slug
		if(isNonEmptyString(slug) && isSystemCategorySlug("Calendar::Event", slug)) {
			setEventType(slug)
		}
		onChange?.(data)
	}

	const submitWith = (data: EventData) => {
		const calendarEvent = data.calendar_event as EventData["calendar_event"] & {
			event_participants_attributes?: EventData["calendar_event"]["event_participants"]
			shift_attributes?: EventData["calendar_event"]["shift"]
		}
		const existingParticipants = calendarEvent.event_participants_attributes
			?? calendarEvent.event_participants
		const participants = (existingParticipants && existingParticipants.length > 0)
			? existingParticipants
			: [{ participant_type: "Client", participant_id: client.id }]
		const usesRailsAttributes = Object.prototype.hasOwnProperty.call(calendarEvent, "shift_attributes")
			|| Object.prototype.hasOwnProperty.call(calendarEvent, "event_participants_attributes")

		const nextCalendarEvent = usesRailsAttributes
			? {
				...omit(calendarEvent, ["event_participants"]),
				event_participants_attributes: participants,
			}
			: {
				...calendarEvent,
				event_participants: participants,
			}

		const payload = {
			...data,
			calendar_event: nextCalendarEvent,
		} as EventData
		const mutation = isEdit ? updateEvent.mutateAsync(payload) : createEvent.mutateAsync(payload)

		return mutation
			.then(() => {
				onSuccess?.()
				return undefined
			})
			.catch((error: unknown) => {
				onError?.()
				throw error
			})
	}

	return (
		<Form<EventData>
			initialData={ initialData }
			railsAttributes={ true }
			submitWith={ submitWith }
		>
			<FormConsumer onChange={ handleChange } />

			<Grid>

				<Grid.Col>
					<CategoriesDropdown
						label="Event Type"
						name="calendar_event.category_slug"
						categoryType="Calendar::Event"
						valueKey="slug"
						defaultValue={ CALENDAR_EVENT_SHIFT }
						comboboxProps={ { withinPortal: false } }
						clearable={ false }
					/>
				</Grid.Col>

				{ eventType === CALENDAR_EVENT_SHIFT &&
					<Grid.Col>
						<EmployeesDropdown
							name="calendar_event.shift.employee_id"
							clearable={ true }
							comboboxProps={ { withinPortal: false } }
						/>
					</Grid.Col>
				}

				{ eventType === CALENDAR_EVENT_OTHER &&
					<Grid.Col>
						<TextInput label="Event Title" name="calendar_event.name" />
					</Grid.Col>
				}

				<SplitDateTimeInput name="calendar_event.starts_at">
					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Date label="Start date" />
					</Grid.Col>
					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Time label="Start time" />
					</Grid.Col>
				</SplitDateTimeInput>

				<SplitDateTimeInput name="calendar_event.ends_at">
					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Date label="End date" />
					</Grid.Col>
					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Time label="End time" />
					</Grid.Col>
				</SplitDateTimeInput>

				<EventTotalHours />

				<Grid.Col>
					<Group style={ { width: "100%" } }>
						<Box style={ { flex: 1, minWidth: 0 } }>
							<Submit>Save Shift</Submit>
						</Box>
						{ isEdit && onCancel && (
							<Button variant="default" onClick={ onCancel } type="button">
								Cancel
							</Button>
						) }
					</Group>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
