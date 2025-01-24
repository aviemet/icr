import { Routes } from "@/lib"
import { IndexPageTemplate } from "@/Features"
import { NewIcon } from "@/Components/Icons"
import IncidentReportsTable from "@/Features/IncidentReports/Table"

interface IncidentReportIndexProps {
	incident_reports: Schema.IncidentReportsIndex[]
	pagination: Schema.Pagination
}

const IncidentReportsIndex = ({ incident_reports, pagination }: IncidentReportIndexProps) => {
	return (
		<IndexPageTemplate
			title="IncidentReports"
			model="incident_reports"
			rows={ incident_reports }
			pagination={ pagination }
			deleteRoute={ Routes.incidentReports() }
			menuOptions={ [
				{ label: "New Incident Report", href: Routes.newIncidentReport(), icon: <NewIcon /> },
			] }
		>
			<IncidentReportsTable />
		</IndexPageTemplate>
	)
}

export default IncidentReportsIndex
