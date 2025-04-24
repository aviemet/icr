import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit } from "@/components/Form"

type TIncidentReportFormData = {
	incident_report: Schema.IncidentReportsFormData
}

export interface IncidentReportFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TIncidentReportFormData>) => boolean | void
	incident_report: Schema.IncidentReportsFormData
}

const IncidentReportForm = ({ method = "post", incident_report, ...props }: IncidentReportFormProps) => {
	return (
		<Form
			model="incident_report"
			data={ { incident_report } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="occurred_at" label="Occurred_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="reported_at" label="Reported_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="agency_notified_at" label="Agency_notified_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="location" label="Location" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ incident_report.id ? "Update" : "Create" } IncidentReport</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default IncidentReportForm
