import { Group, Link, Page, Section, Stack, Text, Title } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, MetricLine, MetricTile, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface ShowIncidentReportProps {
	incident_report: Schema.IncidentReportsShow
}

const ShowIncidentReport = ({ incident_report }: ShowIncidentReportProps) => {
	const title = "Incident Report"
	const doctor = incident_report.doctor
	const client = incident_report.client

	return (
		<Page
			title={ title }
			breadcrumbs={ [
				{ title: "Incident Reports", href: Routes.incidentReports() },
				{ title },
			] }
		>
			<Stack gap="lg">
				<Section>
					<Group justify="space-between" align="center">
						<Title order={ 2 }>{ title }</Title>
						<Link as="button" href={ Routes.editIncidentReport(incident_report.id) } buttonProps={ { variant: "light" } }>
							Edit
						</Link>
					</Group>
					<MetricTile title="Details">
						<MetricLine
							label="Client"
							value={ client
								? (
									<Link href={ Routes.client(client.slug) }>
										{ client.person?.name || client.name }
									</Link>
								)
								: "-" }
						/>
						<MetricLine
							label="Doctor"
							value={ doctor
								? (
									<Link href={ Routes.doctor(doctor.slug) }>
										{ doctor.person?.name || doctor.name }
									</Link>
								)
								: "-" }
						/>
						<MetricLine
							label="Occurred"
							value={ incident_report.occurred_at
								? <DateTimeFormatter>{ incident_report.occurred_at }</DateTimeFormatter>
								: "-" }
						/>
						<MetricLine
							label="Reported"
							value={ incident_report.reported_at
								? <DateTimeFormatter>{ incident_report.reported_at }</DateTimeFormatter>
								: "-" }
						/>
						<MetricLine label="Location" value={ incident_report.location || "-" } />
						<MetricLine
							label="Description"
							value={ <Text size="sm">{ incident_report.description || "-" }</Text> }
						/>
					</MetricTile>
				</Section>

				<CollectionPanel
					title="Hospital Visits"
					count={ incident_report.hospital_visits.length }
					emptyLabel="No linked hospital visits."
				>
					{ incident_report.hospital_visits.map(visit => (
						<RecordRow
							key={ visit.id }
							title={ visit.hospital_name }
							meta={ (
								<>
									{ visit.reason && <span>{ visit.reason }</span> }
									<span>
										{ visit.admitted_at
											? <DateTimeFormatter>{ visit.admitted_at }</DateTimeFormatter>
											: "-" }
										{ " - " }
										{ visit.discharged_at
											? <DateTimeFormatter>{ visit.discharged_at }</DateTimeFormatter>
											: "Ongoing" }
									</span>
								</>
							) }
						/>
					)) }
				</CollectionPanel>
			</Stack>
		</Page>
	)
}

export default ShowIncidentReport
