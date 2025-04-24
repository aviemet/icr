import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import IncidentReportsTable from "@/features/IncidentReports/Table"
import { Routes } from "@/lib"

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
