import { useTranslation } from "react-i18next"

import { ClientForm } from "@/domains/Clients/Form"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface NewClientProps {
	client: Schema.ClientsFormData
	regional_center_options?: Schema.RegionalCentersOptions[]
}

const NewClient = ({ client, regional_center_options = [] }: NewClientProps) => {
	const { t } = useTranslation()
	const title = t("views.clients.new.title")

	return (
		<RecordFormPage
			title={ title }
			description="Add demographics, funding, and communication preferences."
			breadcrumbs={ [
				{ title: t("views.clients.index.title"), href: Routes.clients() },
				{ title: "New" },
			] }
		>
			<ClientForm
				to={ Routes.clients() }
				client={ client }
				regionalCenterOptions={ regional_center_options }
			/>
		</RecordFormPage>
	)
}

export default NewClient
