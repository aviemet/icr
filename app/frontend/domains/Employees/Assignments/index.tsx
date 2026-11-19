import { useTranslation } from "react-i18next"

import { Group, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { Checkbox, DateInput } from "@/components/Inputs"
import { ClientsDropdown, EmployeesDropdown } from "@/components/Inputs/Dropdowns"
import { Routes } from "@/lib"

interface EmployeeAssignmentsProps {
	employee: Schema.EmployeesShow
}

export function EmployeeAssignments({ employee }: EmployeeAssignmentsProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.assignments.managers") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.managers_employees_managers.map(assignment => (
						<Group key={ assignment.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>
									{ assignment.manager.person.name }
									{ assignment.primary ? " (Primary)" : "" }
								</Text>
								<Text size="sm" c="dimmed">
									<DateTimeFormatter>{ assignment.starts_at }</DateTimeFormatter>
									{ " - " }
									{ assignment.ends_at
										? <DateTimeFormatter>{ assignment.ends_at }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeeManager(employee.slug, assignment.id) }
								label={ assignment.manager.person.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.assignments.add_manager") }</Title>
				<Form
					action={ Routes.employeeManagers(employee.slug) }
					method="post"
					initialData={ {
						employees_manager: {
							manager_id: "",
							starts_at: "",
							ends_at: "",
							primary: false,
						},
					} }
				>
					<Stack gap="sm">
						<EmployeesDropdown name="employees_manager.manager_id" label="Manager" />
						<DateInput name="employees_manager.starts_at" label="Starts" />
						<DateInput name="employees_manager.ends_at" label="Ends" />
						<Checkbox name="employees_manager.primary" label="Primary manager" />
						<Submit>Assign Manager</Submit>
					</Stack>
				</Form>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.assignments.attended_clients") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.clients_attendants.map(assignment => (
						<Group key={ assignment.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ assignment.client.person.name }</Text>
								<Text size="sm" c="dimmed">
									<DateTimeFormatter>{ assignment.starts_at }</DateTimeFormatter>
									{ " - " }
									{ assignment.ends_at
										? <DateTimeFormatter>{ assignment.ends_at }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeeClientAttendant(employee.slug, assignment.id) }
								label={ assignment.client.person.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.assignments.add_attended_client") }</Title>
				<Form
					action={ Routes.employeeClientAttendants(employee.slug) }
					method="post"
					initialData={ {
						clients_attendant: {
							client_id: "",
							starts_at: "",
							ends_at: "",
						},
					} }
				>
					<Stack gap="sm">
						<ClientsDropdown name="clients_attendant.client_id" />
						<DateInput name="clients_attendant.starts_at" label="Starts" />
						<DateInput name="clients_attendant.ends_at" label="Ends" />
						<Submit>Assign Client</Submit>
					</Stack>
				</Form>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.assignments.managed_clients") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.clients_managers.map(assignment => (
						<Group key={ assignment.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ assignment.client.person.name }</Text>
								<Text size="sm" c="dimmed">
									<DateTimeFormatter>{ assignment.starts_at }</DateTimeFormatter>
									{ " - " }
									{ assignment.ends_at
										? <DateTimeFormatter>{ assignment.ends_at }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeeClientManager(employee.slug, assignment.id) }
								label={ assignment.client.person.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.assignments.add_managed_client") }</Title>
				<Form
					action={ Routes.employeeClientManagers(employee.slug) }
					method="post"
					initialData={ {
						clients_manager: {
							client_id: "",
							starts_at: "",
							ends_at: "",
						},
					} }
				>
					<Stack gap="sm">
						<ClientsDropdown name="clients_manager.client_id" />
						<DateInput name="clients_manager.starts_at" label="Starts" />
						<DateInput name="clients_manager.ends_at" label="Ends" />
						<Submit>Assign Client</Submit>
					</Stack>
				</Form>
			</Section>
		</Stack>
	)
}
