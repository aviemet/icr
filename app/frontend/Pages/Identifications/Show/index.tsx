import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import IdentificationForm from "../Form"

interface NewIdentificationProps {
	identification: Schema.IdentificationsFormData
}

const NewIdentification = ({ ...data }: NewIdentificationProps) => {
	const title = "New Identification"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Identifications", href: Routes.identifications() },
			{ title: "New Identification" },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<IdentificationForm
					to={ Routes.identifications() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewIdentification
