import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Group, Table, Link, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { useServerTableFilters } from "@/components/Table/useServerTableFilters"
import { Routes } from "@/lib"

import { plainTextFromHtml } from "../plainTextFromHtml"
import { ClientFilter, type TrainingClientOption } from "./ClientFilter"
import {
	trainingFiltersFromServerValues,
	trainingServerFilterFields,
	trainingServerFilterOnly,
} from "./trainingTableFilters"

interface TrainingTableProps {
	records: Schema.EmployeeTrainingsIndex[]
	model: string
	clientOptions?: TrainingClientOption[]
	serverFiltered?: boolean
}

export function TrainingTable({
	records,
	model,
	clientOptions = [],
	serverFiltered = false,
}: TrainingTableProps) {
	const { t } = useTranslation()
	const { values, setMulti } = useServerTableFilters({
		fields: trainingServerFilterFields,
		only: trainingServerFilterOnly,
		enabled: serverFiltered,
	})
	const filters = trainingFiltersFromServerValues(values)
	const [clientSearch, setClientSearch] = useState("")

	const columns: TableColumn<Schema.EmployeeTrainingsIndex>[] = [
		{
			accessor: "name",
			title: t("views.trainings.index.columns.name"),
			sortable: true,
			render: (training) => <Link href={ Routes.training(training.id) }>{ training.name }</Link>,
		},
		{
			accessor: "status",
			title: t("views.trainings.index.columns.status"),
			sortable: true,
			render: (training) => (
				<Link href={ Routes.training(training.id) }>
					{ t(`views.trainings.availability.${training.status}`, { defaultValue: training.status }) }
				</Link>
			),
		},
		{
			accessor: "estimated_minutes",
			title: t("views.trainings.index.columns.duration"),
			sortable: true,
			render: (training) => (
				<Link href={ Routes.training(training.id) }>
					{ typeof training.estimated_minutes === "number"
						? t("views.trainings.index.minutes", { count: training.estimated_minutes })
						: "-" }
				</Link>
			),
		},
		{
			accessor: "clients",
			title: t("views.trainings.index.columns.clients"),
			sortable: false,
			...(serverFiltered
				? {
					filtering: filters.clientIds.length > 0,
					filter: (
						<ClientFilter
							options={ clientOptions }
							searchValue={ clientSearch }
							onSearchChange={ setClientSearch }
							selectedIds={ filters.clientIds }
							onSelectedIdsChange={ value => setMulti("client_ids", value) }
						/>
					),
				}
				: {}),
			render: (training) => {
				const clients = training.clients ?? []
				if(clients.length === 0) return "-"

				return (
					<Group gap={ 4 } wrap="wrap">
						{ clients.map((client) => (
							<Link key={ client.id } href={ Routes.client(client.slug) }>
								{ client.person?.name || client.slug }
							</Link>
						)) }
					</Group>
				)
			},
		},
		{
			accessor: "description",
			title: t("views.trainings.index.columns.description"),
			sortable: true,
			render: (training) => {
				const description = plainTextFromHtml(training.description)
				return (
					<Link href={ Routes.training(training.id) }>
						{ description || "-" }
					</Link>
				)
			},
		},
		{
			accessor: "actions",
			title: t("views.trainings.index.columns.actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (training) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editTraining(training.id) } />
				</Group>
			),
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
