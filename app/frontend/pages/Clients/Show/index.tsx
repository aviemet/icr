import { useTranslation } from "react-i18next"

import { Group, Title, Menu, Page, Section, Tabs } from "@/components"
import { Routes } from "@/lib"

import Contacts from "./Contacts"
import Details from "./Details"
import Documents from "./Documents"

const ShowClient = ({ client }: ShowClientProps) => {
	const { t } = useTranslation()

	const tabsList = [
		{ id: "details", label: t("views.clients.show.tabs.details"), component: Details },
		{ id: "contacts", label: t("views.clients.show.tabs.contacts"), component: Contacts },
		{ id: "documents", label: t("views.clients.show.tabs.documents"), component: Documents },
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

export interface ShowClientProps {
	client: Schema.ClientsShow
}

export default ShowClient
