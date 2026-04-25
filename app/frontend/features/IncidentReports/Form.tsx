import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type TIncidentReportFormData = {
	incident_report: Schema.IncidentReportsFormData
}

export interface IncidentReportFormProps {
	to: string
	method?: HTTPVerb
	incident_report: Schema.IncidentReportsFormData
}

export function IncidentReportForm({ method = "post", to, incident_report, ...props }: IncidentReportFormProps) {
	return (
		<Form<TIncidentReportFormData>
			action={ to }
			initialData={ { incident_report } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="incident_report.occurred_at" label="Occurred_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="incident_report.reported_at" label="Reported_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="incident_report.agency_notified_at" label="Agency_notified_at" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="incident_report.location" label="Location" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ incident_report.id ? "Update" : "Create" } IncidentReport</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
