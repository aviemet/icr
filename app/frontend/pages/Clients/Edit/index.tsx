import { Title, Page, Section } from "@/components"
import ClientsForm from "@/features/Clients/Form"
import { Routes } from "@/lib"

interface EditClientProps {
	client: Schema.ClientsEdit
}

const EditClient = ({ client }: EditClientProps) => {
	const title = `Edit ${client.name}`

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Clients", href: Routes.clients() },
			{ title: client.name, href: Routes.client(client.id) },
			{ title: "Edit" },
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
