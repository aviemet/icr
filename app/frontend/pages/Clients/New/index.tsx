import { useTranslation } from "react-i18next"

import { Title, Page, Section } from "@/components"
import ClientForm from "@/features/Clients/Form"
import { Routes } from "@/lib"

interface NewClientProps {
	client: Schema.ClientsFormData
}

const NewClient = ({ ...data }: NewClientProps) => {
	const { t } = useTranslation()
	const title = t("views.clients.new.title")

	return (
		<Page title={ title }>
			<Section>
				<Title>{ title }</Title>

				<ClientForm
					to={ Routes.clients() }
					{ ...data }
				/>
			</Section>
		</Page>
	)
}

export default NewClient
