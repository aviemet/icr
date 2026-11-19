import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { ClientTable } from "@/domains/Clients/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ClientIndexProps {
	clients: Schema.ClientsIndex[]
	can_updates: Record<string, boolean>
	pagination: Schema.Pagination
}

const ClientsIndex = ({ clients, can_updates, pagination }: ClientIndexProps) => {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canCreate = can("clients", "create")

	return (
		<IndexPageTemplate
			title={ t("views.clients.index.title") }
			model="clients"
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
			dense
			actions={ canCreate
				? [
					{ label: t("views.clients.index.new"), href: Routes.newClient(), icon: <NewIcon /> },
				]
				: [] }
		>
			<ClientTable
				records={ clients }
				canUpdates={ can_updates }
				model="clients"
				serverFiltered
			/>
		</IndexPageTemplate>
	)
}

export default ClientsIndex
