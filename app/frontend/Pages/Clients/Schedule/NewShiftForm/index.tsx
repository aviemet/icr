import { Grid } from "@/Components"
import { DateTimeInput, Form, Submit } from "@/Components/Form"
import { FormEmployeesDropdown } from "@/Features/Dropdowns"
import { Routes } from "@/lib"
import dayjs from "dayjs"
import { type PartialDeep } from "type-fest"
import { type UseFormProps } from "use-inertia-form"

type NewShiftData = {
	calendar_event: PartialDeep<Schema.CalendarEventsFormData> & {
		shift: PartialDeep<Schema.Shift>
	} & {
		event_participants: PartialDeep<Schema.EventParticipantsFormData>[]
	}
}

interface NewClientShiftFormProps {
	client: Schema.ClientsPersisted
	selectedDate: Date
	onSuccess?: (form: UseFormProps<NewShiftData>) => void
	onError?: (form: UseFormProps<NewShiftData>) => void
}


const NewShiftForm = ({ client, selectedDate, onSuccess, onError }: NewClientShiftFormProps) => {
	const initialData: NewShiftData = {
		calendar_event: {
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

	const handleSuccess = (form: UseFormProps<NewShiftData>) => {
		onSuccess?.(form)
	}

	const handleError = (form: UseFormProps<NewShiftData>) => {
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
			<Grid>
				<Grid.Col>
					<FormEmployeesDropdown name="shift.employee_id" />
				</Grid.Col>

				<Grid.Col>
					<DateTimeInput
						label="Start"
						name="starts_at"
					/>
				</Grid.Col>

				<Grid.Col>
					<DateTimeInput
						label="End"
						name="ends_at"
					/>
				</Grid.Col>

				<Grid.Col>
					<Submit>Save Shift</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default NewShiftForm
