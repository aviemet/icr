import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ClientActivityForm from '../Form'

interface INewClientActivityProps {
	client_activity: Schema.ClientActivitiesFormData
}

const NewClientActivity = ({ ...data }: INewClientActivityProps) => {
	const title = 'New Client Activity'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Client Activities', href: Routes.clientActivities() },
			{ title: 'New Client Activity' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<ClientActivityForm
					to={ Routes.clientActivities() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewClientActivity
