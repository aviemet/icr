import { useTranslation } from "react-i18next"

import { ClientForm } from "@/domains/Clients/Form"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface EditClientProps {
	client: Schema.ClientsEdit
}

const EditClient = ({ client }: EditClientProps) => {
	const { t } = useTranslation()
	const title = t("views.clients.edit.title", { name: client.name })

	return (
		<RecordFormPage
			title={ title }
			description="Update demographics, funding, and communication preferences."
			breadcrumbs={ [
				{ title: t("views.clients.index.title"), href: Routes.clients() },
				{ title: client.name, href: Routes.client(client.id) },
				{ title: t("views.clients.edit.action") },
			] }
		>
			<ClientForm
				method="put"
				to={ Routes.client(client.slug) }
				client={ client }
			/>
		</RecordFormPage>
	)
}

export default EditClient
