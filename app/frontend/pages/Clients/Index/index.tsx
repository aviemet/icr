import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { ClientTable } from "@/domains/Clients/Table"
import { IndexPageTemplate } from "@/features"
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
			actions={ [
				{ label: t("views.clients.index.new"), href: Routes.newClient(), icon: <NewIcon /> },
			] }
		>
			<ClientTable records={ clients } model="clients" serverFiltered />
		</IndexPageTemplate>
	)
}

export default ClientsIndex
