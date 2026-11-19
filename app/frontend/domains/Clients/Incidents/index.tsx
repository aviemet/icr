import { useTranslation } from "react-i18next"

import { Group, Link, Section, Stack, Text, Title } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { Routes } from "@/lib"

interface ClientIncidentsProps {
	client: Schema.ClientsShow
}

export function ClientIncidents({ client }: ClientIncidentsProps) {
	const { t } = useTranslation()

	return (
		<Section>
			<Title order={ 3 } mb="md">{ t("views.clients.show.incidents.title") }</Title>
			{ client.incident_reports.length === 0
				? (
					<Text c="dimmed">{ t("views.clients.show.incidents.empty") }</Text>
				)
				: (
					<Stack gap="md">
						{ client.incident_reports.map(incident => (
							<Group key={ incident.id } justify="space-between" align="flex-start">
								<Stack gap={ 2 }>
									<Text fw={ 600 }>
										{ incident.occurred_at
											? <DateTimeFormatter>{ incident.occurred_at }</DateTimeFormatter>
											: "-" }
									</Text>
									<Text size="sm">{ incident.location || "-" }</Text>
									<Text size="sm" lineClamp={ 2 }>{ incident.description }</Text>
								</Stack>
								<Link href={ Routes.incidentReport(incident.id) }>
									{ t("views.clients.show.incidents.view") }
								</Link>
							</Group>
						)) }
					</Stack>
				) }
		</Section>
	)
}
