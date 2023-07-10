import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ClientActivitiesForm from '../Form'

interface IEditClientActivityProps {
	client_activity: Schema.ClientActivitiesEdit
}

const EditClientActivity = ({ client_activity }: IEditClientActivityProps) => {
	const title = 'Edit Client Activity'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Client Activities', href: Routes.clientActivities() },
			{ title: ClientActivity, href: Routes.clientActivity(client_activity.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<ClientActivitiesForm
					method='put'
					to={ Routes.clientActivity() }
					client_activity={ client_activity }
				/>
			</Section>
		</Page>
	)
}

export default EditClientActivity
