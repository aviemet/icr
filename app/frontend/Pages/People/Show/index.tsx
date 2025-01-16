import { Group, Title, Menu, Page, Section } from "@/Components"
import { Routes } from "@/lib"

interface ShowPersonProps {
	person: Schema.PeopleShow
}

const ShowPerson = ({ person }: ShowPersonProps) => {
	const title =  "User"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "User", href: Routes.users() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editUser(person.slug) }>
								Edit Person
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowPerson
