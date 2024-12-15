import React from 'react'
import { Group, Heading, Menu, Page, Section, Tabs } from '@/Components'
import { Routes } from '@/lib'
import Details from './Details'
import Contacts from './Contacts'
import Schedules from './Schedules'
import Documents from './Documents'

export interface ShowClientProps {
	client: Schema.ClientsShow
}

const tabsList = [
	{ id: 'details', label: 'Details', component: Details },
	{ id: 'contacts', label: 'Contacts', component: Contacts },
	{ id: 'schedule', label: 'Schedules', component: Schedules },
	{ id: 'documents', label: 'Documents', component: Documents },
]

const ShowClient = ({ client }: ShowClientProps) => {
	const title = client?.person?.name || 'Client'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Clients', href: Routes.clients() },
			{ title, href: Routes.client(client.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between">
					<Heading>{ title }</Heading>

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
