import dayjs from "dayjs"
import { omit } from "es-toolkit"
import { useMemo, useRef, useState } from "react"

import { Box, Button, Grid, Group } from "@/components"
import { BaseCalendarEvent } from "@/components/Calendar"
import { Form, Submit, FormConsumer, type FormConsumerState } from "@/components/Form"
import { TextInput, SplitDateTimeInput } from "@/components/Inputs"
import { CategoriesDropdown, EmployeesDropdown } from "@/components/Inputs/Dropdowns"
import { type ExpandablePattern, type ScheduleRecurrenceResources } from "@/features/CalendarSchedule"
import { categorySlug, isSystemCategorySlug, isNonEmptyString } from "@/lib"
import { type SystemCategorySlugsFor } from "@/lib/categories"
import { nearestHalfHour } from "@/lib/dates"
import { type CalendarEventData, type CalendarEventEditScope } from "@/queries/calendarEvents"
import { useCreateClientCalendarEvent, useUpdateClientCalendarEvent } from "@/queries/clients"

import { EventTotalHours } from "./EventTotalHours"
import {
	buildRecurringPatternsAttributes,
	defaultRecurrenceConfig,
	recurrenceConfigFromPatterns,
	type RecurrenceConfig,
} from "./recurrenceConfig"
import { RecurringEditScopePrompt } from "./RecurringEditScopePrompt"
import { RepeatFields } from "./RepeatFields"

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
	const employee = resources.employee
	if(typeof employee !== "object" || employee === null || !("id" in employee)) return ""
	return typeof employee.id === "string" ? employee.id : ""
}

function getRecurrenceResources(
	resources: BaseCalendarEvent["resources"],
): ScheduleRecurrenceResources | undefined {
	if(typeof resources !== "object" || resources === null || !("recurrence" in resources)) return undefined
	const recurrence = resources.recurrence
	if(typeof recurrence !== "object" || recurrence === null) return undefined
	if(!("masterId" in recurrence) || !("occurrenceStartsAt" in recurrence) || !("isRecurring" in recurrence)) {
		return undefined
	}
	if(typeof recurrence.masterId !== "string") return undefined
	if(typeof recurrence.occurrenceStartsAt !== "string") return undefined
	if(typeof recurrence.isRecurring !== "boolean") return undefined

	const patterns: ExpandablePattern[] = []
	if("patterns" in recurrence && Array.isArray(recurrence.patterns)) {
		for(const pattern of recurrence.patterns) {
			if(typeof pattern === "object" && pattern !== null) {
				patterns.push(pattern)
			}
		}
	}

	return {
		masterId: recurrence.masterId,
		occurrenceStartsAt: recurrence.occurrenceStartsAt,
		isRecurring: recurrence.isRecurring,
		patterns,
	}
}

function isAbortError(error: unknown) {
	return typeof error === "object"
		&& error !== null
		&& "name" in error
		&& error.name === "AbortError"
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
	const recurrence = existingEvent ? getRecurrenceResources(existingEvent.resources) : undefined
	const masterEventId = recurrence?.masterId ?? (existingEvent ? String(existingEvent.id) : "")
	const [eventType, setEventType] = useState<SystemCategorySlugsFor<"Calendar::Event">>(CALENDAR_EVENT_SHIFT)
	const [repeatConfig, setRepeatConfig] = useState<RecurrenceConfig>(() => {
		if(existingEvent) {
			const resources = getRecurrenceResources(existingEvent.resources)
			return recurrenceConfigFromPatterns(resources?.patterns, existingEvent.start)
		}
		return defaultRecurrenceConfig(selectedDate)
	})
	const [choosingScope, setChoosingScope] = useState(false)
	const repeatConfigRef = useRef(repeatConfig)
	const scopeResolverRef = useRef<((scope: CalendarEventEditScope | null) => void) | null>(null)
	const createEvent = useCreateClientCalendarEvent({ params: { slug: client.slug } })
	const updateEvent = useUpdateClientCalendarEvent({
		params: { slug: client.slug, id: masterEventId },
	})

	const initialData = useMemo<EventData>(() => {
		const baseParticipants = [
			{ participant_type: "Client", participant_id: client.id },
		]
		if(isEdit && existingEvent) {
			const employeeId = getEmployeeIdFromResources(existingEvent.resources)
			return {
				calendar_event: {
					id: masterEventId,
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
	}, [client.id, existingEvent, isEdit, masterEventId, selectedDate])

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

	const handleRepeatChange = (next: RecurrenceConfig) => {
		repeatConfigRef.current = next
		setRepeatConfig(next)
	}

	const promptForEditScope = () => {
		setChoosingScope(true)
		return new Promise<CalendarEventEditScope | null>((resolve) => {
			scopeResolverRef.current = (scope) => {
				scopeResolverRef.current = null
				setChoosingScope(false)
				resolve(scope)
			}
		})
	}

	const resolveEditScope = (scope: CalendarEventEditScope | null) => {
		scopeResolverRef.current?.(scope)
	}

	const submitWith = async (data: EventData) => {
		const calendarEvent = data.calendar_event
		const existingParticipants = calendarEvent.event_participants_attributes
			?? calendarEvent.event_participants
		const participants = (existingParticipants && existingParticipants.length > 0)
			? existingParticipants
			: [{ participant_type: "Client", participant_id: client.id }]
		const usesRailsAttributes = Object.prototype.hasOwnProperty.call(calendarEvent, "shift_attributes")
			|| Object.prototype.hasOwnProperty.call(calendarEvent, "event_participants_attributes")

		let editScope: CalendarEventEditScope = "all"
		const wasRecurring = recurrence?.isRecurring === true
		if(isEdit && wasRecurring) {
			const chosen = await promptForEditScope()
			if(chosen === null) {
				const abortError = new Error("Aborted")
				abortError.name = "AbortError"
				throw abortError
			}
			editScope = chosen
		}

		const startsAt = calendarEvent.starts_at ?? existingEvent?.start ?? selectedDate
		const builtPatterns = buildRecurringPatternsAttributes(
			repeatConfigRef.current,
			startsAt,
			wasRecurring && recurrence
				? { shiftWeekdaysFrom: recurrence.occurrenceStartsAt }
				: undefined,
		)
		const includePatterns = !isEdit || editScope !== "one"
		const recurringPatterns = includePatterns
			? (builtPatterns ?? (wasRecurring || repeatConfigRef.current.enabled ? [] : undefined))
			: undefined

		const editFields = isEdit
			? {
				edit_scope: editScope,
				...(recurrence
					? { occurrence_starts_at: recurrence.occurrenceStartsAt }
					: {}),
			}
			: {}

		const baseCalendarEvent = omit(calendarEvent, [
			"event_participants",
			"event_participants_attributes",
			"recurring_patterns",
			"recurring_patterns_attributes",
		])

		const nextCalendarEvent: EventData["calendar_event"] = usesRailsAttributes
			? {
				...baseCalendarEvent,
				event_participants_attributes: participants,
				...(calendarEvent.shift_attributes
					? { shift_attributes: calendarEvent.shift_attributes }
					: calendarEvent.shift
						? { shift_attributes: calendarEvent.shift }
						: {}),
				...(recurringPatterns !== undefined
					? { recurring_patterns_attributes: recurringPatterns }
					: {}),
				...editFields,
			}
			: {
				...baseCalendarEvent,
				event_participants: participants,
				...(calendarEvent.shift ? { shift: calendarEvent.shift } : {}),
				...(recurringPatterns !== undefined
					? { recurring_patterns: recurringPatterns }
					: {}),
				...editFields,
			}

		const payload: EventData = {
			...data,
			calendar_event: nextCalendarEvent,
		}
		const mutation = isEdit ? updateEvent.mutateAsync(payload) : createEvent.mutateAsync(payload)

		return mutation
			.then(() => {
				onSuccess?.()
				return undefined
			})
			.catch((error: unknown) => {
				if(!isAbortError(error)) {
					onError?.()
				}
				throw error
			})
	}

	const repeatMinDate = dayjs(existingEvent?.start ?? selectedDate).startOf("day").toDate()

	return (
		<Form<EventData>
			initialData={ initialData }
			railsAttributes={ true }
			submitWith={ submitWith }
		>
			<FormConsumer onChange={ handleChange } />

			{ choosingScope
				? (
					<RecurringEditScopePrompt
						onChoose={ resolveEditScope }
						onCancel={ () => resolveEditScope(null) }
					/>
				)
				: (
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

						<RepeatFields
							value={ repeatConfig }
							onChange={ handleRepeatChange }
							minDate={ repeatMinDate }
						/>

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
				) }
		</Form>
	)
}
