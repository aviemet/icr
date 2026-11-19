import { useTranslation } from "react-i18next"

import { Group, Title, Menu, Page, Section, Tabs } from "@/components"
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

const ShowClient = ({ client }: ShowClientProps) => {
	const { t } = useTranslation()

	const tabsList = [
		{ id: "overview", label: t("views.clients.show.tabs.overview"), component: Overview },
		{ id: "profile", label: t("views.clients.show.tabs.profile"), component: Profile },
		{ id: "contacts", label: t("views.clients.show.tabs.contacts"), component: Contacts },
		{ id: "health", label: t("views.clients.show.tabs.health"), component: Health },
		{ id: "medications", label: t("views.clients.show.tabs.medications"), component: Medications },
		{ id: "care", label: t("views.clients.show.tabs.care"), component: Care },
		{ id: "documents", label: t("views.clients.show.tabs.documents"), component: Documents },
		{ id: "incidents", label: t("views.clients.show.tabs.incidents"), component: Incidents },
	]

	const title = client?.person?.name || t("views.clients.show.title")

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: t("views.clients.index.title"), href: Routes.clients() },
			{ title, href: Routes.client(client.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editClient(client.slug) }>
								{ t("views.clients.show.edit") }
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>


				<Tabs urlControlled={ true } defaultValue={ tabsList[0].id }>
					<Tabs.List>
						{ tabsList.map(tab => (
							<Tabs.Tab key={ tab.id } value={ tab.id }>{ tab.label }</Tabs.Tab>
						)) }
					</Tabs.List>

					{ tabsList.map(tab => {
						const Component = tab.component

						return (
							<Tabs.Panel key={ tab.id } value={ tab.id } p="md">
								<Component client={ client } />
							</Tabs.Panel>
						)
					}) }
				</Tabs>

			</Section>

		</Page>
	)
}

export default ShowClient
