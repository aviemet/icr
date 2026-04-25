import { Group, Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface TrainingTableProps {
	records: Schema.TrainingsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function TrainingTable({ records, pagination, model }: TrainingTableProps) {
	const columns: TableColumn<Schema.TrainingsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (training) => <Link href={ Routes.training(training.id) }>{ training.name }</Link>,
		},
		{
			accessor: "estimated_minutes",
			title: "Duration",
			sortable: true,
			render: (training) => <Link href={ Routes.training(training.id) }>{ training.estimated_minutes }</Link>,
		},
		{
			accessor: "description",
			title: "Description",
			sortable: true,
			render: (training) => <Link href={ Routes.training(training.id) }>{ training.description }</Link>,
		},
		{
			accessor: "actions",
			title: "Actions",
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
			pagination={ pagination }
			model={ model }
			selectable
		/>
	)
}
