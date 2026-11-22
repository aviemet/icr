import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateTimeInput, TextInput, Textarea } from "@/components/Inputs"
import { ClientsDropdown, DoctorsDropdown } from "@/components/Inputs/Dropdowns"
import { type HTTPVerb } from "@/lib"

type IncidentReportFormRecord = Schema.IncidentReportsFormData | Schema.IncidentReportsEdit

type TIncidentReportFormData = {
	incident_report: IncidentReportFormRecord
}

export interface IncidentReportFormProps {
	to: string
	method?: HTTPVerb
	incident_report: IncidentReportFormRecord
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
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<ClientsDropdown name="incident_report.client_id" required />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<DoctorsDropdown name="incident_report.doctor_id" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<DateTimeInput name="incident_report.occurred_at" label="Occurred At" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<DateTimeInput name="incident_report.reported_at" label="Reported At" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<DateTimeInput name="incident_report.agency_notified_at" label="Agency Notified At" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="incident_report.location" label="Location" />
				</Grid.Col>
				<Grid.Col>
					<Textarea name="incident_report.description" label="Description" minRows={ 3 } />
				</Grid.Col>
				<Grid.Col>
					<Submit>{ incident_report.id ? "Update" : "Create" } Incident Report</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
