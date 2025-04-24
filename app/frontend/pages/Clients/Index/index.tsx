import { IndexPageTemplate } from "@/features"
import ClientsTable from "@/features/Clients/Table"
import { Routes } from "@/lib"

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
		>
			<ClientsTable />
		</IndexPageTemplate>
	)
}

export default ClientsIndex
