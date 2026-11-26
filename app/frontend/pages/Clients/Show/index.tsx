import { useTranslation } from "react-i18next"

import { Avatar, Badge, Presence, ScheduleButton, Text } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import {
	MedicalHospitalVisits,
	MedicalMedications,
	MedicalOverview,
} from "@/domains/Clients/Medical"
import { RecordShowShell } from "@/features"
import { initials, Routes } from "@/lib"
import { useFeatures, usePermissions } from "@/lib/hooks"

import Care from "./Care"
import Compliance from "./Compliance"
import Contacts from "./Contacts"
import Documents from "./Documents"
import Incidents from "./Incidents"
import Overview from "./Overview"
import Profile from "./Profile"
import Trainings from "./Trainings"


export interface ShowClientProps {
	client: Schema.ClientsShow
	can_update?: boolean
	can_view_open_shifts?: boolean
	open_shifts_count?: number
	trainingOptions?: Schema.EmployeeTrainingsOptions[]
	regional_center_options?: Schema.RegionalCentersOptions[]
}

const ShowClient = ({
	client,
	trainingOptions = [],
	regional_center_options = [],
}: ShowClientProps) => {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const { enabled } = useFeatures()
	const title = client?.person?.name || t("views.clients.show.title")
	const isActive = Boolean(client.active_at)
	const showCompliance = enabled("compliance_forms") && (
		can("compliance/form_submissions", "index") || can("compliance/form_submissions", "show")
	)

	return (
		<RecordShowShell
			title={ title }
			breadcrumbs={ [
				{ title: t("views.clients.index.title"), href: Routes.clients() },
				{ title, href: Routes.client(client.slug) },
			] }
			avatar={ (
				<Avatar
					src={ client.portrait_url || undefined }
					radius="xl"
					size={ 44 }
					color="brand"
				>
					{ initials(title) ?? "?" }
				</Avatar>
			) }
			badge={ isActive
				? <Badge color="green" variant="light">Active</Badge>
				: undefined }
			meta={ (
				<>
					<Text size="sm" c="dimmed" component="span">
						{ t("views.clients.show.overview.client_number") }: <Presence>{ client.number }</Presence>
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
				{
					id: "profile",
					label: t("views.clients.show.tabs.profile"),
					panel: <Profile client={ client } regional_center_options={ regional_center_options } />,
				},
				{ id: "contacts", label: t("views.clients.show.tabs.contacts"), panel: <Contacts client={ client } /> },
				{
					id: "medical",
					label: t("views.clients.show.tabs.medical"),
					defaultSection: "overview",
					sections: [
						{
							id: "overview",
							label: t("views.clients.show.medical.sections.overview"),
							panel: <MedicalOverview client={ client } />,
						},
						{
							id: "medications",
							label: t("views.clients.show.medical.sections.medications"),
							panel: <MedicalMedications client={ client } />,
						},
						{
							id: "hospital_visits",
							label: t("views.clients.show.medical.sections.hospital_visits"),
							panel: <MedicalHospitalVisits client={ client } />,
						},
					],
				},
				{ id: "care", label: t("views.clients.show.tabs.care"), panel: <Care client={ client } /> },
				...(showCompliance
					? [{ id: "compliance", label: t("views.clients.show.tabs.compliance"), panel: <Compliance client={ client } /> }]
					: []),
				{
					id: "trainings",
					label: t("views.clients.show.tabs.trainings"),
					panel: <Trainings client={ client } trainingOptions={ trainingOptions } />,
				},
				{ id: "documents", label: t("views.clients.show.tabs.documents"), panel: <Documents client={ client } /> },
				{ id: "incidents", label: t("views.clients.show.tabs.incidents"), panel: <Incidents client={ client } /> },
			] }
		/>
	)
}

export default ShowClient
