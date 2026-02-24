import dayjs from "dayjs"
import { type PartialDeep } from "type-fest"
import { type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { DateTimeInput, Form, Submit, FormConsumer } from "@/components/Form"
import { FormCategoriesDropdown, FormEmployeesDropdown } from "@/features/Dropdowns"
import { Routes } from "@/lib"

const CALENDAR_EVENT_SHIFT_SLUG = "calendar-event-shift"

export type NewEventData = {
	calendar_event: Omit<PartialDeep<Schema.CalendarEventsFormData>, "event_participants"> & {
		category_id?: string
		shift: PartialDeep<Schema.Shift>
		event_participants: PartialDeep<Schema.EventParticipantsFormData>[]
	}
}

interface NewClientEventFormProps {
	client: Schema.ClientsPersisted
	selectedDate: Date
	onSuccess?: (form: UseFormProps<NewEventData>) => void
	onError?: (form: UseFormProps<NewEventData>) => void
	onChange?: (form: UseFormProps<NewEventData>) => void
}

export function NewEventForm({ client, selectedDate, onSuccess, onError, onChange }: NewClientEventFormProps) {
	const initialData: NewEventData = {
		calendar_event: {
			category_id: CALENDAR_EVENT_SHIFT_SLUG,
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
	}

	const handleChange = (form: UseFormProps<NewEventData>) => {
		console.log({ data: form.data })
		onChange?.(form)
	}

	const handleSuccess = (form: UseFormProps<NewEventData>) => {
		onSuccess?.(form)
	}

	const handleError = (form: UseFormProps<NewEventData>) => {
		onError?.(form)
	}

	return (
		<Form
			async
			remember={ false }
			model="calendar_event"
			onSuccess={ handleSuccess }
			onError={ handleError }
			to={ Routes.apiCalendarEvents() }
			data={ initialData }
			railsAttributes={ true }
		>
			<FormConsumer<NewEventData> onChange={ handleChange } />

			<Grid>

				<Grid.Col>
					<FormCategoriesDropdown
						label="Event Type"
						categoryType="Calendar::Event"
						valueKey="slug"
						defaultValue={ CALENDAR_EVENT_SHIFT_SLUG }
						comboboxProps={ { withinPortal: false } }
					/>
				</Grid.Col>

				<Grid.Col>
					<FormEmployeesDropdown name="shift.employee_id" />
				</Grid.Col>

				<Grid.Col>
					<DateTimeInput
						label="Start"
						name="starts_at"
						popoverProps={ { withinPortal: false } }
					/>
				</Grid.Col>

				<Grid.Col>
					<DateTimeInput
						label="End"
						name="ends_at"
						popoverProps={ { withinPortal: false } }
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Save Shift</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
