import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IncidentReportsForm from '../Form'

interface EditIncidentReportProps {
	incident_report: Schema.IncidentReportsEdit
}

const EditIncidentReport = ({ incident_report }: EditIncidentReportProps) => {
	const title = 'Edit Incident Report'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Incident Reports', href: Routes.incidentReports() },
			{ title: IncidentReport, href: Routes.incidentReport(incident_report.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<IncidentReportsForm
					method='put'
					to={ Routes.incidentReport() }
					incident_report={ incident_report }
				/>
			</Section>
		</Page>
	)
}

export default EditIncidentReport
