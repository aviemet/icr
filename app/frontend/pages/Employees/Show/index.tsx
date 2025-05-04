import { useTranslation } from "react-i18next"

import { Badge, Group, Title, Menu, Page, Section, Tabs } from "@/components"
import { Routes } from "@/lib"

import Contacts from "./Contacts"
import Details from "./Details"
import Documents from "./Documents"

export interface ShowEmployeeProps {
	employee: Schema.EmployeesShow
}

const ShowEmployee = ({ employee }: ShowEmployeeProps) => {
	const { t } = useTranslation()

	const tabsList = [
		{ id: "details", label: t("views.employees.show.tabs.details"), component: Details },
		{ id: "contacts", label: t("views.employees.show.tabs.contacts"), component: Contacts },
		{ id: "documents", label: t("views.employees.show.tabs.documents"), component: Documents },
	]

	const title = employee?.person?.name || t("views.employees.show.title")
	const employeeStatus = employee?.status

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: t("views.employees.index.title"), href: Routes.employees() },
			{ title, href: Routes.employee(employee.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between" align="flex-start">
					<Group align="center" gap="sm">
						<Title>{ title }</Title>
						{ employeeStatus === "applicant" && <Badge>{ employeeStatus.charAt(0).toUpperCase() + employeeStatus.slice(1) }</Badge> }
					</Group>

					<Group>
						<Menu position="bottom-end">
							<Menu.Target>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Link href={ Routes.editEmployee(employee.slug) }>
									{ t("views.employees.show.edit") }
								</Menu.Link>
								<Menu.Link href={ Routes.statusEmployee(employee.slug) }>
									{ t("views.employees.show.change_status") }
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
