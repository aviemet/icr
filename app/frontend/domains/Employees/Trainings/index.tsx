import { useTranslation } from "react-i18next"

import { Group, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, Select } from "@/components/Inputs"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface EmployeeTrainingsProps {
	employee: Schema.EmployeesShow
	trainingOptions: Schema.EmployeeTrainingsOptions[]
	canCompleteTrainings?: boolean
}

export function EmployeeTrainings({
	employee,
	trainingOptions,
	canCompleteTrainings = false,
}: EmployeeTrainingsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()

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
							<Select
								name="employees_training.training_id"
								label={ t("views.employees.show.trainings.fields.training") }
								options={ options }
								required
							/>
							<DateInput
								name="employees_training.started_at"
								label={ t("views.employees.show.trainings.fields.started") }
							/>
							{ canCompleteTrainings && (
								<DateInput
									name="employees_training.completed_at"
									label={ t("views.employees.show.trainings.fields.completed") }
								/>
							) }
							<Submit>{ t("views.employees.show.trainings.assign") }</Submit>
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
							<span>
								{ t(`views.trainings.status.${row.status}`, { defaultValue: row.status }) }
							</span>
							{ row.started_at && (
								<span>
									{ t("views.employees.show.trainings.fields.started") }:{ " " }
									<DateTimeFormatter>{ row.started_at }</DateTimeFormatter>
								</span>
							) }
							{ row.completed_at && (
								<span>
									{ t("views.employees.show.trainings.fields.completed") }:{ " " }
									<DateTimeFormatter>{ row.completed_at }</DateTimeFormatter>
								</span>
							) }
						</>
					) }
					actions={ canUpdate
						? (
							<Group gap="xs">
								{ !row.completed_at && canCompleteTrainings && (
									<Form
										action={ Routes.employeeTraining(employee.slug, row.id) }
										method="put"
										initialData={ {
											employees_training: {
												completed_at: new Date().toISOString(),
											},
										} }
									>
										<Submit size="xs" variant="light">
											{ t("views.employees.show.trainings.mark_complete") }
										</Submit>
									</Form>
								) }
								<CollectionAddModal
									canUpdate={ canUpdate }
									label={ t("views.employees.show.trainings.edit_dates") }
								>
									<Form
										action={ Routes.employeeTraining(employee.slug, row.id) }
										method="put"
										initialData={ {
											employees_training: canCompleteTrainings
												? {
													started_at: row.started_at ?? "",
													completed_at: row.completed_at ?? "",
												}
												: {
													started_at: row.started_at ?? "",
												},
										} }
									>
										<Stack gap="sm">
											<DateInput
												name="employees_training.started_at"
												label={ t("views.employees.show.trainings.fields.started") }
											/>
											{ canCompleteTrainings && (
												<DateInput
													name="employees_training.completed_at"
													label={ t("views.employees.show.trainings.fields.completed") }
												/>
											) }
											<Submit>{ t("views.employees.show.trainings.save_dates") }</Submit>
										</Stack>
									</Form>
								</CollectionAddModal>
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
