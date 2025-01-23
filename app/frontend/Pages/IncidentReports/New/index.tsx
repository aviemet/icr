import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import IncidentReportForm from "../Form"

interface INewIncidentReportProps {
	incident_report: Schema.IncidentReportsFormData
}

const NewIncidentReport = ({ ...data }: INewIncidentReportProps) => {
	const title = "New Incident Report"

	return (
		<Page title={ title }>

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
