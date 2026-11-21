import { useTranslation } from "react-i18next"

import { Group, Stack, Table, Text, Link } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { Checkbox, Select } from "@/components/Inputs"
import { CollectionAddModal, CollectionPanel } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface ClientTrainingsProps {
	client: Schema.ClientsShow
	trainingOptions: Schema.EmployeeTrainingsOptions[]
}

export function ClientTrainings({ client, trainingOptions }: ClientTrainingsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const rows = client.clients_trainings ?? []

	const options = trainingOptions.map(training => ({
		value: training.id,
		label: training.name ?? training.id,
	}))

	return (
		<CollectionPanel
			title={ t("views.clients.show.trainings.title") }
			count={ rows.length }
			emptyLabel={ t("views.clients.show.trainings.empty") }
			actions={ (
				<CollectionAddModal
					canUpdate={ canUpdate }
					label={ t("views.clients.show.trainings.associate") }
				>
					<Form
						action={ Routes.clientTrainings(client.slug) }
						method="post"
						initialData={ {
							clients_training: {
								training_id: "",
								required: false,
							},
						} }
					>
						<Stack gap="sm">
							<Select
								name="clients_training.training_id"
								label={ t("views.clients.show.trainings.fields.training") }
								options={ options }
								required
							/>
							<Checkbox
								name="clients_training.required"
								label={ t("views.clients.show.trainings.fields.required") }
							/>
							<Submit>{ t("views.clients.show.trainings.associate") }</Submit>
						</Stack>
					</Form>
				</CollectionAddModal>
			) }
		>
			{ rows.length > 0 && (
				<Table.Provider>
					<Table>
						<Table.Head>
							<Table.Row>
								<Table.HeadCell>{ t("views.clients.show.trainings.columns.name") }</Table.HeadCell>
								<Table.HeadCell>{ t("views.clients.show.trainings.columns.duration") }</Table.HeadCell>
								<Table.HeadCell>{ t("views.clients.show.trainings.columns.required") }</Table.HeadCell>
								<Table.HeadCell>{ t("views.clients.show.trainings.columns.description") }</Table.HeadCell>
								{ canUpdate && (
									<Table.HeadCell>{ t("views.clients.show.trainings.columns.actions") }</Table.HeadCell>
								) }
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{ rows.map((row) => (
								<Table.Row key={ row.id }>
									<Table.Cell>
										<Link href={ Routes.training(row.training.id) }>
											{ row.training.name }
										</Link>
									</Table.Cell>
									<Table.Cell>
										{ typeof row.training.estimated_minutes === "number"
											? t("views.trainings.index.minutes", { count: row.training.estimated_minutes })
											: "-" }
									</Table.Cell>
									<Table.Cell>
										{ canUpdate
											? (
												<Form
													action={ Routes.clientTraining(client.slug, row.id) }
													method="put"
													initialData={ {
														clients_training: {
															required: row.required,
														},
													} }
												>
													<Group gap="xs" wrap="nowrap">
														<Checkbox
															name="clients_training.required"
															label={ t("views.clients.show.trainings.fields.required") }
														/>
														<Submit size="xs" variant="light">
															{ t("views.clients.show.trainings.save") }
														</Submit>
													</Group>
												</Form>
											)
											: (
												<Text size="sm">
													{ row.required
														? t("views.clients.show.trainings.required_yes")
														: t("views.clients.show.trainings.required_no") }
												</Text>
											) }
									</Table.Cell>
									<Table.Cell>
										<Text size="sm" lineClamp={ 2 }>{ row.training.description || "-" }</Text>
									</Table.Cell>
									{ canUpdate && (
										<Table.Cell>
											<DeleteButton
												href={ Routes.clientTraining(client.slug, row.id) }
												label={ row.training.name }
											/>
										</Table.Cell>
									) }
								</Table.Row>
							)) }
						</Table.Body>
					</Table>
				</Table.Provider>
			) }
		</CollectionPanel>
	)
}
