import { Title, Page, Section } from "@/components"
import IncidentReportsForm from "@/features/IncidentReports/Form"
import { Routes } from "@/lib"

interface EditIncidentReportProps {
	incident_report: Schema.IncidentReportsEdit
}

const EditIncidentReport = ({ incident_report }: EditIncidentReportProps) => {
	const title = "Edit Incident Report"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Incident Reports", href: Routes.incidentReports() },
			{ title: "Incident Report", href: Routes.incidentReport(incident_report.id) },
			{ title },
		] }>
			<Section>
				<Title>{ title }</Title>

				<IncidentReportsForm
					method="put"
					to={ Routes.incidentReport(incident_report.id) }
					incident_report={ incident_report }
				/>
			</Section>
		</Page>
	)
}

export default EditIncidentReport
