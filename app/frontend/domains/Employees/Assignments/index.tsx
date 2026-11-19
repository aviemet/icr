import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { Checkbox, DateInput } from "@/components/Inputs"
import { ClientsDropdown, EmployeesDropdown } from "@/components/Inputs/Dropdowns"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface EmployeeAssignmentsProps {
	employee: Schema.EmployeesShow
}

function dateRange(starts: string | Date | null | undefined, ends: string | Date | null | undefined) {
	return (
		<span>
			{ starts ? <DateTimeFormatter>{ starts }</DateTimeFormatter> : "-" }
			{ " - " }
			{ ends ? <DateTimeFormatter>{ ends }</DateTimeFormatter> : "Current" }
		</span>
	)
}

export function EmployeeAssignments({ employee }: EmployeeAssignmentsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()

	return (
		<Stack gap="lg">
			<CollectionPanel
				title={ t("views.employees.show.assignments.managers") }
				count={ employee.managers_employees_managers.length }
				emptyLabel="No managers assigned."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.assignments.add_manager") }
					>
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
					</CollectionAddModal>
				) }
			>
				{ employee.managers_employees_managers.map(assignment => (
					<RecordRow
						key={ assignment.id }
						title={ assignment.primary
							? `${assignment.manager.person.name} (Primary)`
							: assignment.manager.person.name }
						meta={ dateRange(assignment.starts_at, assignment.ends_at) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeManager(employee.slug, assignment.id) }
									label={ assignment.manager.person.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.employees.show.assignments.attended_clients") }
				count={ employee.clients_attendants.length }
				emptyLabel="No attended clients."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.assignments.add_attended_client") }
					>
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
					</CollectionAddModal>
				) }
			>
				{ employee.clients_attendants.map(assignment => (
					<RecordRow
						key={ assignment.id }
						title={ assignment.client.person.name }
						meta={ dateRange(assignment.starts_at, assignment.ends_at) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeClientAttendant(employee.slug, assignment.id) }
									label={ assignment.client.person.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.employees.show.assignments.managed_clients") }
				count={ employee.clients_managers.length }
				emptyLabel="No managed clients."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.assignments.add_managed_client") }
					>
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
					</CollectionAddModal>
				) }
			>
				{ employee.clients_managers.map(assignment => (
					<RecordRow
						key={ assignment.id }
						title={ assignment.client.person.name }
						meta={ dateRange(assignment.starts_at, assignment.ends_at) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeClientManager(employee.slug, assignment.id) }
									label={ assignment.client.person.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
