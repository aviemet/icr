import { useTranslation } from "react-i18next"

import { Group, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, Select } from "@/components/Inputs"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface EmployeeTrainingsProps {
	employee: Schema.EmployeesShow
	trainingOptions: Schema.EmployeeTrainingsOptions[]
}

export function EmployeeTrainings({ employee, trainingOptions }: EmployeeTrainingsProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canUpdate = can("employees", "update")

	const options = trainingOptions.map(training => ({
		value: training.id,
		label: training.name ?? training.id,
	}))

	return (
		<CollectionPanel
			title={ t("views.employees.show.trainings.title") }
			count={ employee.employees_trainings.length }
			emptyLabel={ t("views.employees.show.trainings.empty") }
			actions={ (
				<CollectionAddModal
					canUpdate={ canUpdate }
					label={ t("views.employees.show.trainings.assign") }
				>
					<Form
						action={ Routes.employeeTrainings(employee.slug) }
						method="post"
						initialData={ {
							employees_training: {
								training_id: "",
								started_at: new Date().toISOString(),
								completed_at: "",
							},
						} }
					>
						<Stack gap="sm">
							<Select name="employees_training.training_id" label="Training" options={ options } required />
							<DateInput name="employees_training.started_at" label="Started" />
							<DateInput name="employees_training.completed_at" label="Completed" />
							<Submit>Assign Training</Submit>
						</Stack>
					</Form>
				</CollectionAddModal>
			) }
		>
			{ employee.employees_trainings.map(row => (
				<RecordRow
					key={ row.id }
					tone={ row.completed_at ? "default" : "warning" }
					title={ row.training.name }
					meta={ (
						<>
							<span>{ row.status }</span>
							{ row.completed_at && (
								<span><DateTimeFormatter>{ row.completed_at }</DateTimeFormatter></span>
							) }
						</>
					) }
					actions={ canUpdate
						? (
							<Group gap="xs">
								{ !row.completed_at && (
									<Form
										action={ Routes.employeeTraining(employee.slug, row.id) }
										method="put"
										initialData={ {
											employees_training: {
												completed_at: new Date().toISOString(),
											},
										} }
									>
										<Submit size="xs" variant="light">Mark Complete</Submit>
									</Form>
								) }
								<DeleteButton
									href={ Routes.employeeTraining(employee.slug, row.id) }
									label={ row.training.name }
								/>
							</Group>
						)
						: undefined }
				/>
			)) }
		</CollectionPanel>
	)
}
