import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { type HTTPVerb } from "@/lib"

type TimesheetFormData = {
	timesheet: Schema.TimesheetsFormData
}

export interface TimesheetFormProps {
	to: string
	method?: HTTPVerb
	timesheet: Schema.TimesheetsFormData
}

export function TimesheetForm({ method = "post", to, timesheet, ...props }: TimesheetFormProps) {
	return (
		<Form<TimesheetFormData>
			action={ to }
			initialData={ { timesheet } }
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
