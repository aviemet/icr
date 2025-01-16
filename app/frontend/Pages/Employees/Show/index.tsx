import { Group, Heading, Menu, Page, Section, Tabs } from "@/Components"
import { Routes } from "@/lib"
import Details from "./Details"
import Contacts from "./Contacts"
import Documents from "./Documents"

export interface ShowEmployeeProps {
	employee: Schema.EmployeesShow
}

const tabsList = [
	{ id: "details", label: "Details", component: Details },
	{ id: "contacts", label: "Contact Details", component: Contacts },
	{ id: "documents", label: "Documents", component: Documents },
]

const ShowEmployee = ({ employee }: ShowEmployeeProps) => {
	const title = employee?.person?.name || "Employee"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Employees", href: Routes.employees() },
			{ title, href: Routes.employee(employee.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between">
					<Heading>{ title }</Heading>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editEmployee(employee.slug) }>
								Edit Employee
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>


				<Tabs urlControlled={ true } defaultValue={ tabsList[0].id }>
					<Tabs.List>
						{ tabsList.map(tab => (
							<Tabs.Tab key={ tab.id } value={ tab.id }>{ tab.label }</Tabs.Tab>
						)) }
					</Tabs.List>

					{ tabsList.map(tab => {
						const Component = tab.component

						return (
							<Tabs.Panel key={ tab.id } value={ tab.id } p="md">
								<Component employee={ employee } />
							</Tabs.Panel>
						)
					}) }
				</Tabs>

			</Section>

		</Page>
	)
}

export default ShowEmployee
