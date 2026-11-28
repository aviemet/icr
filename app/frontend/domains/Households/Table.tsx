import { DataTable, Link, Box, Group, type TableColumn } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { Routes } from "@/lib"

interface HouseholdTableProps {
	records: Schema.HouseholdsIndex[]
	model: string
}

export function HouseholdTable({ records, model }: HouseholdTableProps) {
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
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
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
		<DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
