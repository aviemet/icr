import { Title, Page, Section } from "@/Components"
import { Routes, withLayout } from "@/lib"
import PersonForm from "@/Features/Settings/People/Form"

interface NewPersonProps {
	person: Schema.PeopleFormData
}

const NewPerson = ({ ...data }: NewPersonProps) => {
	const title = "New Person"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "People", href: Routes.settingsPeople() },
			{ title: "New Person", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<PersonForm
					to={ Routes.settingsPeople() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default withLayout(NewPerson, "settings")
