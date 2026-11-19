import { TextInput } from "@mantine/core"

import { Group, Link, type TableColumn } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { DateTimeFormatter } from "@/components/Formatters"
import { Routes } from "@/lib"

type ClientColumnFilters = {
	firstName: string
	lastName: string
	number: string
	uciNumber: string
}

function ColumnTextFilter({
	label,
	value,
	onChange,
}: {
	label: string
	value: string
	onChange: (value: string) => void
}) {
	return (
		<TextInput
			label={ label }
			placeholder={ label }
			value={ value }
			onChange={ event => onChange(event.currentTarget.value) }
		/>
	)
}

export function useClientTableColumns({
	serverFiltered,
	filters,
	setText,
}: {
	serverFiltered: boolean
	filters: ClientColumnFilters
	setText: (param: string, value: string) => void
}) {
	const columns: TableColumn<Schema.ClientsIndex>[] = [
		{
			accessor: "people.first_name",
			title: "First Name",
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.firstName !== "",
					filter: (
						<ColumnTextFilter
							label="First Name"
							value={ filters.firstName }
							onChange={ value => setText("first_name", value) }
						/>
					),
				}
				: {}),
			render: (client) => <Link href={ Routes.client(client.slug) }>{ client.person.first_name }</Link>,
		},
		{
			accessor: "people.last_name",
			title: "Last Name",
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.lastName !== "",
					filter: (
						<ColumnTextFilter
							label="Last Name"
							value={ filters.lastName }
							onChange={ value => setText("last_name", value) }
						/>
					),
				}
				: {}),
			render: (client) => <Link href={ Routes.client(client.slug) }>{ client.person.last_name }</Link>,
		},
		{
			accessor: "number",
			title: "Client #",
			sortable: true,
			...(serverFiltered
				? {
					filtering: filters.number !== "",
					filter: (
						<ColumnTextFilter
							label="Client #"
							value={ filters.number }
							onChange={ value => setText("number", value) }
						/>
					),
				}
				: {}),
			render: (client) => <Link href={ Routes.client(client.slug) }>{ client.number }</Link>,
		},
		{
			accessor: "uci_number",
			title: "UCI",
			sortable: false,
			...(serverFiltered
				? {
					filtering: filters.uciNumber !== "",
					filter: (
						<ColumnTextFilter
							label="UCI"
							value={ filters.uciNumber }
							onChange={ value => setText("uci_number", value) }
						/>
					),
				}
				: {}),
			render: (client) => client.uci_number || "-",
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

	return columns
}
