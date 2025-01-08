import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IncidentReportForm from '../Form'

interface NewIncidentReportProps {
	incident_report: Schema.IncidentReportsFormData
}

const NewIncidentReport = ({ ...data }: NewIncidentReportProps) => {
	const title = 'New Incident Report'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Incident Reports', href: Routes.incidentReports() },
			{ title: 'New Incident Report' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<IncidentReportForm
					to={ Routes.incidentReports() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewIncidentReport
