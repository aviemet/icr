import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import ClientForm from "@/Features/Clients/Form"

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
