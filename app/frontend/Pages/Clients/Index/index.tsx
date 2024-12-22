import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import ClientsTable from '../Table'

interface ClientIndexProps {
	clients: Schema.ClientsIndex[]
	pagination: Schema.Pagination
}

const ClientsIndex = ({ clients, pagination }: ClientIndexProps) => {
	return (
		<IndexPageTemplate
			title="Clients"
			model="clients"
			rows={ clients }
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
			menuOptions={ [
				{ label: 'New Client', href: Routes.newClient(), icon: <NewIcon /> },
			] }
		>
			<ClientsTable />
		</IndexPageTemplate>
	)
}

export default ClientsIndex
