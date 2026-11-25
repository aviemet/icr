import { useTranslation } from "react-i18next"

import { ScheduleButton, Text } from "@/components"
import { RecordShowShell } from "@/features"
import { Routes } from "@/lib"

import Clients from "./Clients"
import Contacts from "./Contacts"
import Overview from "./Overview"
import Profile from "./Profile"

export interface ShowHouseholdProps {
	household: Schema.HouseholdsShow
	can_update?: boolean
	available_clients?: Schema.ClientsOptions[]
}

const ShowHousehold = ({
	household,
	available_clients = [],
}: ShowHouseholdProps) => {
	const { t } = useTranslation()
	const title = household.name || t("views.households.show.title")

	return (
		<RecordShowShell
			title={ title }
			breadcrumbs={ [
				{ title: t("views.households.index.title"), href: Routes.households() },
				{ title, href: Routes.household(household.slug) },
			] }
			meta={ (
				<Text size="sm" c="dimmed" component="span">
					{ household.current_memberships.length } { t("views.households.show.overview.members").toLowerCase() }
				</Text>
			) }
			actions={ (
				<ScheduleButton
					href={ Routes.scheduleHousehold(household.slug) }
					appearance="button"
				/>
			) }
			tabs={ [
				{
					id: "overview",
					label: t("views.households.show.tabs.overview"),
					panel: <Overview household={ household } />,
				},
				{
					id: "profile",
					label: t("views.households.show.tabs.profile"),
					panel: <Profile household={ household } />,
				},
				{
					id: "contacts",
					label: t("views.households.show.tabs.contacts"),
					panel: <Contacts household={ household } />,
				},
				{
					id: "clients",
					label: t("views.households.show.tabs.clients"),
					panel: (
						<Clients
							household={ household }
							available_clients={ available_clients }
						/>
					),
				},
			] }
		/>
	)
}

export default ShowHousehold
