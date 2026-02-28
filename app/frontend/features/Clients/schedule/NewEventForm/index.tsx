import { useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useMemo, useState } from "react"
import { type PartialDeep } from "type-fest"
import { type UseFormProps, useForm } from "use-inertia-form"

import { Grid, Text } from "@/components"
import { DateTimeInput, Form, Submit, FormConsumer, SplitDateTimeInput, TextInput } from "@/components/Form"
import { FormCategoriesDropdown, FormEmployeesDropdown } from "@/features/Dropdowns"
import { categorySlug, isSystemCategorySlug, isNonEmptyString } from "@/lib"
import { type SystemCategorySlugsFor } from "@/lib/categories"
import { nearestHalfHour } from "@/lib/dates"
import { useCreateCalendarEvent } from "@/queries/calendarEvents"
import { EventTotalHours } from "./EventTotalHours"

const CALENDAR_EVENT_SHIFT = categorySlug("Calendar::Event", "Shift")
const CALENDAR_EVENT_OTHER = categorySlug("Calendar::Event", "Other")

export type NewEventData = {
	calendar_event: Omit<PartialDeep<Schema.CalendarEventsFormData>, "event_participants"> & {
		category_slug?: string
		shift: PartialDeep<Schema.Shift>
		event_participants: PartialDeep<Schema.EventParticipantsFormData>[]
	}
}

interface NewClientEventFormProps {
	client: Schema.ClientsPersisted
	selectedDate?: Date
	onSuccess?: (form: UseFormProps<NewEventData>) => void
	onError?: (form: UseFormProps<NewEventData>) => void
	onChange?: (form: UseFormProps<NewEventData>) => void
}

export function NewEventForm({
	client,
	selectedDate = nearestHalfHour(),
	onSuccess,
	onError,
	onChange,
}: NewClientEventFormProps) {
	const [eventType, setEventType] = useState<SystemCategorySlugsFor<"Calendar::Event">>(CALENDAR_EVENT_SHIFT)
	const queryClient = useQueryClient()
	const createEvent = useCreateCalendarEvent({
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [`clients/${client.slug}/schedule`] })
		},
	})

	const initialData = useMemo<NewEventData>(() => ({
		calendar_event: {
			category_slug: CALENDAR_EVENT_SHIFT,
			starts_at: selectedDate,
			ends_at: dayjs(selectedDate).add(8, "hours").toDate(),
			shift: {
				employee_id: "",
			},
			event_participants: [
				{
					participant_type: "Client",
					participant_id: client.id,
				},
			],
		},
	}), [selectedDate, client.id])

	const handleChange = (form: UseFormProps<NewEventData>) => {
		const slug = form.data.calendar_event.category_slug
		if(isNonEmptyString(slug) && isSystemCategorySlug("Calendar::Event", slug)) {
			setEventType(slug)
		}

		onChange?.(form)
	}

	const handleSuccess = (form: UseFormProps<NewEventData>) => {
		onSuccess?.(form)
	}

	const handleError = (form: UseFormProps<NewEventData>) => {
		onError?.(form)
	}

	return (
		<Form<NewEventData>
			remember={ false }
			model="calendar_event"
			onSuccess={ handleSuccess }
			onError={ handleError }
			submitWith={ ({ data }) => createEvent.mutateAsync(data).then(() => undefined) }
			data={ initialData }
			railsAttributes={ true }
		>
			<FormConsumer<NewEventData> onChange={ handleChange } />

			<Grid>

				<Grid.Col>
					<FormCategoriesDropdown
						label="Event Type"
						name="category_slug"
						categoryType="Calendar::Event"
						valueKey="slug"
						defaultValue={ CALENDAR_EVENT_SHIFT }
						comboboxProps={ { withinPortal: false } }
						clearable={ false }
					/>
				</Grid.Col>

				{ eventType === CALENDAR_EVENT_SHIFT &&
					<Grid.Col>
						<FormEmployeesDropdown name="shift.employee_id" />
					</Grid.Col>
				}

				{ eventType === CALENDAR_EVENT_OTHER &&
					<Grid.Col>
						<TextInput label="Event Title" name="name" />
					</Grid.Col>
				}

				<SplitDateTimeInput<NewEventData> model="calendar_event" name="starts_at">
					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Date label="Start date" />
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Time label="Start time" />
					</Grid.Col>
				</SplitDateTimeInput>

				<SplitDateTimeInput<NewEventData> model="calendar_event" name="ends_at">
					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Date label="End date" />
					</Grid.Col>

					<Grid.Col span={ 6 }>
						<SplitDateTimeInput.Time label="End time" />
					</Grid.Col>
				</SplitDateTimeInput>

				<EventTotalHours />

				<Grid.Col>
					<Submit loading={ createEvent.isPending }>Save Shift</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
