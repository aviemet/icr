import { Link, Table, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ScheduleTableProps {
	records: Schema.ClientsIndex[]
	model?: string
}

export function ScheduleTable({ records, model }: ScheduleTableProps) {
	const columns: TableColumn<Schema.ClientsIndex>[] = [
		{
			accessor: "first_name",
			title: "First Name",
			render: (client) => <Link href={ Routes.scheduleClient(client.slug) }>{ client.first_name }</Link>,
		},
		{
			accessor: "last_name",
			title: "Last Name",
			render: (client) => client.last_name,
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (client) => <EditButton href={ Routes.editClient(client.slug) } />,
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
