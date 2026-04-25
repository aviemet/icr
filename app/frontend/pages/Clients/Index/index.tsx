import { useTranslation } from "react-i18next"

import { IndexPageTemplate } from "@/features"
import { ClientTable } from "@/features/Clients/Table"
import { Routes } from "@/lib"

interface ClientIndexProps {
	clients: Schema.ClientsIndex[]
	pagination: Schema.Pagination
}

const ClientsIndex = ({ clients, pagination }: ClientIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.clients.index.title") }
			model="clients"
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
		>
			<ClientTable records={ clients } pagination={ pagination } model="clients" />
		</IndexPageTemplate>
	)
}

export default ClientsIndex
