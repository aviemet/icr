import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import PersonForm from "../Form"

interface NewPersonProps {
	person: Schema.PeopleFormData
}

const NewPerson = ({ ...data }: NewPersonProps) => {
	const title = "New Person"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Users", href: Routes.users() },
			{ title: "New User", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<PersonForm
					to={ Routes.users() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewPerson
