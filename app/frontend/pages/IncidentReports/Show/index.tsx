import { Title, Page, Section } from "@/components"
import IncidentReportForm from "@/features/IncidentReports/Form"
import { Routes } from "@/lib"

interface NewIncidentReportProps {
	incident_report: Schema.IncidentReportsFormData
}

const NewIncidentReport = ({ ...data }: NewIncidentReportProps) => {
	const title = "New Incident Report"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Incident Reports", href: Routes.incidentReports() },
			{ title: "New Incident Report" },
		] }>

			<Section>
				<Title>{ title }</Title>

				<IncidentReportForm
					to={ Routes.incidentReports() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewIncidentReport
