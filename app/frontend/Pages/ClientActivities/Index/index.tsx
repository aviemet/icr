import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Layouts/AppLayout/Components'
import { NewIcon } from '@/Components/Icons'
import ClientActivitiesTable from '../Table'

interface IClientActivityIndexProps {
	client_activities: Schema.ClientActivitiesIndex[]
	pagination: Schema.Pagination
}

const ClientActivitiesIndex = ({ client_activities, pagination }: IClientActivityIndexProps) => {
	return (
		<IndexPageTemplate
			title="ClientActivities"
			model="client_activities"
			rows={ client_activities }
			pagination={ pagination }
			deleteRoute={ Routes.clientActivities() }
			menuOptions={ [
				{ label: 'New Client Activity', href: Routes.newClientActivity(), icon: NewIcon },
			] }
		>
			<ClientActivitiesTable />
		</IndexPageTemplate>
	)
}

export default ClientActivitiesIndex
