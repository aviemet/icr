import { Table, Link, Group } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import { type TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface ClientTableProps {
	records: Schema.ClientsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function ClientTable({ records, pagination, model }: ClientTableProps) {
	const columns: TableColumn<Schema.ClientsIndex>[] = [
		{
			accessor: "people.first_name",
			title: "First Name",
			sortable: true,
			render: (client) => <Link href={ Routes.client(client.slug) }>{ client.person.first_name }</Link>,
		},
		{
			accessor: "people.last_name",
			title: "Last Name",
			sortable: true,
			render: (client) => <Link href={ Routes.client(client.slug) }>{ client.person.last_name }</Link>,
		},
		{
			accessor: "number",
			title: "Client #",
			sortable: true,
			render: (client) => <Link href={ Routes.client(client.slug) }>{ client.number }</Link>,
		},
		{
			accessor: "active_at",
			title: "Client Since",
			sortable: true,
			render: (client) => <DateTimeFormatter tooltipFormats={ ["fromNow"] }>{ client.active_at }</DateTimeFormatter>,
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (client) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editClient(client.slug) } />
					<ScheduleButton href={ Routes.scheduleClient(client.slug) } />
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
