import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface ClientIncidentsProps {
	client: Schema.ClientsShow
}

export function ClientIncidents({ client }: ClientIncidentsProps) {
	const { t } = useTranslation()

	return (
		<CollectionPanel
			title={ t("views.clients.show.incidents.title") }
			count={ client.incident_reports.length }
			emptyLabel={ t("views.clients.show.incidents.empty") }
		>
			{ client.incident_reports.map(incident => (
				<RecordRow
					key={ incident.id }
					title={ incident.occurred_at
						? <DateTimeFormatter>{ incident.occurred_at }</DateTimeFormatter>
						: "-" }
					meta={ (
						<>
							<span>{ incident.location || "-" }</span>
							<span>{ incident.description }</span>
						</>
					) }
					actions={ (
						<Link href={ Routes.incidentReport(incident.id) }>
							{ t("views.clients.show.incidents.view") }
						</Link>
					) }
				/>
			)) }
		</CollectionPanel>
	)
}
