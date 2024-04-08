import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Layouts/AppLayout/Components'
import { NewIcon } from '@/Components/Icons'
import ClientsTable from '../Table'

interface IClientIndexProps {
	clients: Schema.ClientsIndex[]
	pagination: Schema.Pagination
}

const ClientsIndex = ({ clients, pagination }: IClientIndexProps) => {
	return (
		<IndexPageTemplate
			title="Clients"
			model="clients"
			rows={ clients }
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
			menuOptions={ [
				{ label: 'New Client', href: Routes.newClient(), icon: NewIcon },
			] }
		>
			<ClientsTable />
		</IndexPageTemplate>
	)
}

export default ClientsIndex
