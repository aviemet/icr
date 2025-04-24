import { Title, Page, Section } from "@/components"
import ClientForm from "@/features/Clients/Form"
import { Routes } from "@/lib"

interface NewClientProps {
	client: Schema.ClientsFormData
}

const NewClient = ({ ...data }: NewClientProps) => {
	const title = "New Client"

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
