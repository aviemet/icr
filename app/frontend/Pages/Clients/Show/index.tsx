import { Group, Title, Menu, Page, Section, Tabs } from "@/Components"
import { Routes } from "@/lib"

import Contacts from "./Contacts"
import Details from "./Details"
import Documents from "./Documents"

const tabsList = [
	{ id: "details", label: "Details", component: Details },
	{ id: "contacts", label: "Contact Details", component: Contacts },
	{ id: "documents", label: "Documents", component: Documents },
]

export interface ShowClientProps {
	client: Schema.ClientsShow
}

const ShowClient = ({ client }: ShowClientProps) => {
	const title = client?.person?.name || "Client"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Clients", href: Routes.clients() },
			{ title, href: Routes.client(client.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editClient(client.slug) }>
								Edit Client
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
