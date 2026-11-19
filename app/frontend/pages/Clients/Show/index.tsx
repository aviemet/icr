import { useTranslation } from "react-i18next"

import { Avatar, Badge, ScheduleButton, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { RecordShowShell } from "@/features"
import { Routes } from "@/lib"

import Care from "./Care"
import Contacts from "./Contacts"
import Documents from "./Documents"
import Health from "./Health"
import Incidents from "./Incidents"
import Medications from "./Medications"
import Overview from "./Overview"
import Profile from "./Profile"

export interface ShowClientProps {
	client: Schema.ClientsShow
}

function personInitials(name: string) {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if(parts.length === 0) return "?"
	if(parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
	return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

const ShowClient = ({ client }: ShowClientProps) => {
	const { t } = useTranslation()
	const title = client?.person?.name || t("views.clients.show.title")
	const isActive = Boolean(client.active_at)

	return (
		<RecordShowShell
			title={ title }
			breadcrumbs={ [
				{ title: t("views.clients.index.title"), href: Routes.clients() },
				{ title, href: Routes.client(client.slug) },
			] }
			avatar={ (
				<Avatar radius="xl" size={ 44 } color="brand">
					{ personInitials(title) }
				</Avatar>
			) }
			badge={ isActive
				? <Badge color="green" variant="light">Active</Badge>
				: undefined }
			meta={ (
				<>
					<Text size="sm" c="dimmed" component="span">
						{ t("views.clients.show.overview.client_number") }: { client.number || "-" }
					</Text>
					{ client.active_at && (
						<Text size="sm" c="dimmed" component="span">
							Since <DateTimeFormatter>{ client.active_at }</DateTimeFormatter>
						</Text>
					) }
				</>
			) }
			actions={ <ScheduleButton href={ Routes.scheduleClient(client.slug) } appearance="button" /> }
			tabs={ [
				{ id: "overview", label: t("views.clients.show.tabs.overview"), panel: <Overview client={ client } /> },
				{ id: "profile", label: t("views.clients.show.tabs.profile"), panel: <Profile client={ client } /> },
				{ id: "contacts", label: t("views.clients.show.tabs.contacts"), panel: <Contacts client={ client } /> },
				{ id: "health", label: t("views.clients.show.tabs.health"), panel: <Health client={ client } /> },
				{ id: "medications", label: t("views.clients.show.tabs.medications"), panel: <Medications client={ client } /> },
				{ id: "care", label: t("views.clients.show.tabs.care"), panel: <Care client={ client } /> },
				{ id: "documents", label: t("views.clients.show.tabs.documents"), panel: <Documents client={ client } /> },
				{ id: "incidents", label: t("views.clients.show.tabs.incidents"), panel: <Incidents client={ client } /> },
			] }
		/>
	)
}

export default ShowClient
