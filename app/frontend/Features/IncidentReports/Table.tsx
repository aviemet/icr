import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"
import { DateTimeFormatter } from "@/Components/Formatters"

const IncidentReportTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="occurred_at">Occurred_at</Table.HeadCell>
					<Table.HeadCell sort="reported_at">Reported_at</Table.HeadCell>
					<Table.HeadCell sort="agency_notified_at">Agency_notified_at</Table.HeadCell>
					<Table.HeadCell sort="location">Location</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (incident_report: Schema.IncidentReportsIndex) => (
					<Table.Row key={ incident_report.id }>

						<Table.Cell>
							<Link href={ Routes.incidentReport(incident_report.id) }>
								<DateTimeFormatter>{ incident_report?.occurred_at }</DateTimeFormatter>
							</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.incidentReport(incident_report.id) }>
								<DateTimeFormatter>{ incident_report?.reported_at }</DateTimeFormatter>
							</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.incidentReport(incident_report.id) }>
								<DateTimeFormatter>{ incident_report?.agency_notified_at }</DateTimeFormatter>
							</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.incidentReport(incident_report.id) }>
								{ incident_report.location }
							</Link>
						</Table.Cell>

						<Table.Cell>
							<EditButton href={ Routes.editIncidentReport(incident_report.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default IncidentReportTable
