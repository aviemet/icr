import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit } from "@/components/Form"

type TimesheetFormData = {
	timesheet: Schema.TimesheetsFormData
}

export interface TimesheetFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TimesheetFormData>) => boolean | void
	timesheet: Schema.TimesheetsFormData
}

const TimesheetForm = ({ method = "post", timesheet, ...props }: TimesheetFormProps) => {
	return (
		<Form
			model="timesheet"
			data={ { timesheet } }
			method={ method }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<Submit>{ timesheet.id ? "Update" : "Create" } Timesheet</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default TimesheetForm
