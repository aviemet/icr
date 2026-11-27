import {DataTable, Link, type TableColumn} from "@/components"
import { EditButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import { Routes } from "@/lib"

interface IncidentReportTableProps {
	records: Schema.IncidentReportsIndex[]
	model?: string
}

export function IncidentReportTable({ records, model }: IncidentReportTableProps) {
	const columns: TableColumn<Schema.IncidentReportsIndex>[] = [
		{
			accessor: "occurred_at",
			title: "Occurred_at",
			sortable: true,
			render: (incidentReport) => (
				<Link href={ Routes.incidentReport(incidentReport.id) }>
					<DateTimeFormatter>{ incidentReport.occurred_at }</DateTimeFormatter>
				</Link>
			),
		},
		{
			accessor: "reported_at",
			title: "Reported_at",
			sortable: true,
			render: (incidentReport) => (
				<Link href={ Routes.incidentReport(incidentReport.id) }>
					<DateTimeFormatter>{ incidentReport.reported_at }</DateTimeFormatter>
				</Link>
			),
		},
		{
			accessor: "agency_notified_at",
			title: "Agency_notified_at",
			sortable: true,
			render: (incidentReport) => (
				<Link href={ Routes.incidentReport(incidentReport.id) }>
					<DateTimeFormatter>{ incidentReport.agency_notified_at }</DateTimeFormatter>
				</Link>
			),
		},
		{
			accessor: "location",
			title: "Location",
			sortable: true,
			render: (incidentReport) => (
				<Link href={ Routes.incidentReport(incidentReport.id) }>
					{ incidentReport.location }
				</Link>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (incidentReport) => <EditButton href={ Routes.editIncidentReport(incidentReport.id) } />,
		},
	]

	return (
		<DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
