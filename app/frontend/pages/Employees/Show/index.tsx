import { Badge, Group, Title, Menu, Page, Section, Tabs } from "@/components"
import { Routes } from "@/lib"

import Contacts from "./Contacts"
import Details from "./Details"
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
	const status = employee?.status

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Employees", href: Routes.employees() },
			{ title, href: Routes.employee(employee.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between" align="flex-start">
					<Group align="center" gap="sm">
						<Title>{ title }</Title>
						{ status && <Badge>{ status.charAt(0).toUpperCase() + status.slice(1) }</Badge> }
					</Group>

					<Group>
						<Menu position="bottom-end">
							<Menu.Target>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Link href={ Routes.editEmployee(employee.slug) }>
									Edit Employee
								</Menu.Link>
								<Menu.Link href={ Routes.statusEmployee(employee.slug) }>
									Change Status
								</Menu.Link>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Group>


				<Tabs urlControlled={ true } defaultValue={ tabsList[0].id } mt="md">
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
