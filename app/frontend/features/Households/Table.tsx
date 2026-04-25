import { Table, Link, Box, Group } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { type TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface HouseholdTableProps {
	records: Schema.HouseholdsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function HouseholdTable({ records, pagination, model }: HouseholdTableProps) {
	const columns: TableColumn<Schema.HouseholdsIndex>[] = [
		{
			accessor: "name",
			title: "Household Name",
			sortable: true,
			render: (household) => <Link href={ Routes.household(household.slug) }>{ household.name }</Link>,
		},
		{
			accessor: "clients",
			title: "Clients",
			sortable: false,
			render: (household) => (
				<>
					{ household.clients.map(client => (
						<Box key={ client.slug }>
							<Link href={ Routes.client(client.slug) }>{ client.full_name }</Link>
						</Box>
					)) }
				</>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (household) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editHousehold(household.slug) } />
					<ScheduleButton href={ Routes.scheduleHousehold(household.slug) } />
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
