import { Heading, Page, Section } from "@/Components"
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
