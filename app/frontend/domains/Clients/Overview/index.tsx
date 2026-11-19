import { useTranslation } from "react-i18next"

import {
	Box,
	Group,
	Link,
	ScheduleButton,
	Section,
	Stack,
	Text,
	Title,
} from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { Routes } from "@/lib"

interface ClientOverviewProps {
	client: Schema.ClientsShow
}

export function ClientOverview({ client }: ClientOverviewProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="lg">
			<Group justify="space-between" align="flex-start">
				<Stack gap={ 4 }>
					<Title order={ 3 }>{ client.person.name }</Title>
					<Text size="sm" c="dimmed">
						{ t("views.clients.show.overview.client_number") }: { client.number || "-" }
					</Text>
					{ client.active_at && (
						<Text size="sm" c="dimmed">
							Since <DateTimeFormatter>{ client.active_at }</DateTimeFormatter>
						</Text>
					) }
				</Stack>
				<ScheduleButton href={ Routes.scheduleClient(client.slug) } />
			</Group>

			<Group grow align="stretch">
				<Section>
					<Title order={ 4 } mb="sm">{ t("views.clients.show.overview.funding") }</Title>
					<Stack gap={ 4 }>
						<Text size="sm">{ t("views.clients.show.overview.uci") }: { client.uci_number || "-" }</Text>
						<Text size="sm">{ t("views.clients.show.overview.regional_center") }: { client.regional_center || "-" }</Text>
						<Text size="sm">
							{ t("views.clients.show.overview.ipp_review") }:{ " " }
							{ client.ipp_review_on
								? <DateTimeFormatter>{ client.ipp_review_on }</DateTimeFormatter>
								: "-" }
						</Text>
					</Stack>
				</Section>

				<Section>
					<Title order={ 4 } mb="sm">{ t("views.clients.show.overview.ihss") }</Title>
					<Stack gap={ 4 }>
						<Text size="sm">Authorized hours: { client.ihss_authorized_hours ?? "-" }</Text>
						<Text size="sm">Share of cost: { client.ihss_share_of_cost ?? "-" }</Text>
					</Stack>
				</Section>

				<Section>
					<Title order={ 4 } mb="sm">{ t("views.clients.show.overview.health_alerts") }</Title>
					<Stack gap={ 4 }>
						<Text size="sm">{ t("views.clients.show.overview.active_meds") }: { client.active_prescriptions_count }</Text>
						<Text size="sm">{ t("views.clients.show.overview.allergies") }: { client.active_allergies_count }</Text>
						<Text size="sm">{ t("views.clients.show.overview.incidents") }: { client.incident_reports_count }</Text>
						<Text size="sm">{ t("views.clients.show.overview.emergency_contacts") }: { client.emergency_contacts_count }</Text>
					</Stack>
				</Section>
			</Group>

			<Group grow align="stretch">
				<Section>
					<Title order={ 4 } mb="sm">{ t("views.clients.show.overview.care_team") }</Title>
					<Stack gap={ 4 }>
						<Text size="sm">
							{ t("views.clients.show.overview.manager") }:{ " " }
							{ client.current_manager?.person?.name || t("views.clients.show.overview.none") }
						</Text>
						<Text size="sm">
							{ t("views.clients.show.overview.attendants") }:{ " " }
							{ client.current_attendants.length > 0
								? client.current_attendants.map(attendant => attendant.person.name).join(", ")
								: t("views.clients.show.overview.none") }
						</Text>
						<Text size="sm">
							{ t("views.clients.show.overview.household") }:{ " " }
							{ client.household
								? <Link href={ Routes.household(client.household.slug) }>{ client.household.name }</Link>
								: "-" }
						</Text>
					</Stack>
				</Section>

				<Section>
					<Title order={ 4 } mb="sm">{ t("views.clients.show.overview.quick_links") }</Title>
					<Stack gap={ 4 }>
						<Box><Link href={ `${Routes.client(client.slug)}?tab=profile` }>Profile</Link></Box>
						<Box><Link href={ `${Routes.client(client.slug)}?tab=medications` }>Medications</Link></Box>
						<Box><Link href={ `${Routes.client(client.slug)}?tab=documents` }>Documents</Link></Box>
						<Box><Link href={ `${Routes.client(client.slug)}?tab=incidents` }>Incidents</Link></Box>
						<Box><Link href={ Routes.scheduleClient(client.slug) }>Schedule</Link></Box>
					</Stack>
				</Section>
			</Group>
		</Stack>
	)
}
