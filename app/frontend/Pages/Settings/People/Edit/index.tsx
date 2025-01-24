import { Page, Section, Title } from "@/Components"
import { Routes, withLayout } from "@/lib"
import PersonForm from "@/Features/Settings/People/Form"

interface EditPersonProps {
	person: Schema.PeopleEdit
}

const EditPerson = ({ person }: EditPersonProps) => {
	const title = "Edit Person"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "People", href: Routes.settingsPeople() },
			{ title: "Person", href: Routes.settingsPerson(person.slug) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<PersonForm
					method='put'
					to={ Routes.settingsPerson(person.slug) }
					person={ person }
				/>
			</Section>
		</Page>
	)
}

export default withLayout(EditPerson, "settings")
