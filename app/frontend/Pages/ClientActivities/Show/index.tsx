import React from 'react'
import { Group, Heading, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface IShowClientActivityProps {
	client_activity: Schema.ClientActivitiesShow
}

const ShowClientActivity = ({ client_activity }: IShowClientActivityProps) => {
	const title =  'ClientActivity'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Client Activity', href: Routes.clientActivities() },
			{ title },
		] }>
			<Section>
				<Group position="apart">
					<Heading>{ title }</Heading>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editClientActivity(client_activity.id) }>
								Edit ClientActivity
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowClientActivity
