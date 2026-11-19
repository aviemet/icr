import { useTranslation } from "react-i18next"

import { Badge, Group, Title, Menu, Page, Section, Tabs } from "@/components"
import { Routes } from "@/lib"

import Assignments from "./Assignments"
import Contacts from "./Contacts"
import Credentials from "./Credentials"
import Documents from "./Documents"
import Overview from "./Overview"
import Pay from "./Pay"
import Profile from "./Profile"
import Trainings from "./Trainings"

export interface ShowEmployeeProps {
	employee: Schema.EmployeesShow
	trainingOptions?: Schema.EmployeeTrainingsOptions[]
}

const ShowEmployee = ({ employee, trainingOptions = [] }: ShowEmployeeProps) => {
	const { t } = useTranslation()

	const tabsList = [
		{ id: "overview", label: t("views.employees.show.tabs.overview"), component: Overview },
		{ id: "profile", label: t("views.employees.show.tabs.profile"), component: Profile },
		{ id: "contacts", label: t("views.employees.show.tabs.contacts"), component: Contacts },
		{ id: "credentials", label: t("views.employees.show.tabs.credentials"), component: Credentials },
		{ id: "assignments", label: t("views.employees.show.tabs.assignments"), component: Assignments },
		{ id: "trainings", label: t("views.employees.show.tabs.trainings"), component: Trainings },
		{ id: "pay", label: t("views.employees.show.tabs.pay"), component: Pay },
		{ id: "documents", label: t("views.employees.show.tabs.documents"), component: Documents },
	]

	const title = employee?.person?.name || t("views.employees.show.title")
	const employeeStatus = employee?.status
	const statusLabel = employeeStatus
		? t(`views.employees.table.statuses.${employeeStatus}`, { defaultValue: employeeStatus })
		: ""

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: t("views.employees.index.title"), href: Routes.employees() },
			{ title, href: Routes.employee(employee.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between" align="flex-start">
					<Group align="center" gap="sm">
						<Title>{ title }</Title>
						{ employeeStatus && <Badge>{ statusLabel }</Badge> }
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
								<Component employee={ employee } trainingOptions={ trainingOptions } />
							</Tabs.Panel>
						)
					}) }
				</Tabs>

			</Section>

		</Page>
	)
}

export default ShowEmployee
