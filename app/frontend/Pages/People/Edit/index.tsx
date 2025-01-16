import { Heading, Page, Section, Title } from "@/Components"
import { Routes } from "@/lib"
import PeopleForm from "../Form"

interface EditPersonProps {
	person: Schema.PeopleEdit
}

const EditPerson = ({ person }: EditPersonProps) => {
	const title = "Edit Person"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Users", href: Routes.users() },
			{ title: "User", href: Routes.user(person.slug) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<PeopleForm
					method='put'
					to={ Routes.user(person.slug) }
					person={ person }
				/>
			</Section>
		</Page>
	)
}

export default EditPerson
