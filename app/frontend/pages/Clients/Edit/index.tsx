import { useTranslation } from "react-i18next"

import { Title, Page, Section } from "@/components"
import ClientsForm from "@/features/Clients/Form"
import { Routes } from "@/lib"

interface EditClientProps {
	client: Schema.ClientsEdit
}

const EditClient = ({ client }: EditClientProps) => {
	const { t } = useTranslation()
	const title = t("views.clients.edit.title", { name: client.name })

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: t("views.clients.index.title"), href: Routes.clients() },
			{ title: client.name, href: Routes.client(client.id) },
			{ title: t("views.clients.edit.action") },
		] }>
			<Section>
				<Title>{ title }</Title>

				<ClientsForm
					method="put"
					to={ Routes.client(client.slug) }
					client={ client }
				/>
			</Section>
		</Page>
	)
}

export default EditClient
