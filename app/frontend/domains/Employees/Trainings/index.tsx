import { useTranslation } from "react-i18next"

import { Group, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, Select } from "@/components/Inputs"
import { Routes } from "@/lib"

interface EmployeeTrainingsProps {
	employee: Schema.EmployeesShow
	trainingOptions: Schema.EmployeeTrainingsOptions[]
}

export function EmployeeTrainings({ employee, trainingOptions }: EmployeeTrainingsProps) {
	const { t } = useTranslation()

	const options = trainingOptions.map(training => ({
		value: training.id,
		label: training.name ?? training.id,
	}))

	return (
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.trainings.title") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.employees_trainings.map(row => (
						<Group key={ row.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ row.training.name }</Text>
								<Text size="sm" c="dimmed">
									{ row.status }
									{ row.completed_at
										? <> - <DateTimeFormatter>{ row.completed_at }</DateTimeFormatter></>
										: "" }
								</Text>
							</Stack>
							<Group>
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
						</Group>
					)) }
					{ employee.employees_trainings.length === 0 && (
						<Text c="dimmed">{ t("views.employees.show.trainings.empty") }</Text>
					) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.trainings.assign") }</Title>
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
			</Section>
		</Stack>
	)
}
