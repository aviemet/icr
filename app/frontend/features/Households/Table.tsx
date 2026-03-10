import { Table, Link, Box } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

export function HouseholdTable(props: TableProps) {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.Cell sort="name">Household Name</Table.Cell>
					<Table.Cell>Clients</Table.Cell>
					<Table.Cell className="actions">Actions</Table.Cell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (household: Schema.HouseholdsIndex) => (
					<Table.Row key={ household.id }>
						<Table.Cell>
							<Link href={ Routes.household(household.slug) }>{ household.name }</Link>
						</Table.Cell>

						<Table.Cell>{ household.clients.map(client => (
							<Box><Link href={ Routes.client(client.slug) }>{ client.full_name }</Link></Box>
						))

						}</Table.Cell>

						<Table.Cell>
							<EditButton href={ Routes.editHousehold(household.slug) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}
