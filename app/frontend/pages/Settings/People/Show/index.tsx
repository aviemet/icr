import { Group, Title, Menu, Page, Section } from "@/components"
import { Routes, withLayout } from "@/lib"

interface ShowPersonProps {
	person: Schema.PeopleShow
}

const ShowPerson = ({ person }: ShowPersonProps) => {
	const title = person?.name || "Person"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "People", href: Routes.settingsPeople() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editSettingsPerson(person.slug) }>
								Edit Person
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default withLayout(ShowPerson, "settings")
