import { Routes } from "@/lib"
import { Table, Link, DateTimeDisplay, Group } from "@/Components"
import { EditButton, ScheduleButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const ClientTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="people.first_name">First Name</Table.HeadCell>
					<Table.HeadCell sort="people.last_name">Last Name</Table.HeadCell>
					<Table.HeadCell sort="number">Client #</Table.HeadCell>
					<Table.HeadCell sort="active_at">Client Since</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (client: Schema.ClientsIndex) => (
					<Table.Row key={ client.id }>
						<Table.Cell>
							<Link href={ Routes.client(client.slug) }>{ client.person.first_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.client(client.slug) }>{ client.person.last_name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.client(client.slug) }>{ client.number }</Link>
						</Table.Cell>

						<Table.Cell fitContent>
							<DateTimeDisplay tooltipFormats={ ["fromNow"] }>{ client.active_at }</DateTimeDisplay>
						</Table.Cell>

						<Table.Cell>
							<Group wrap="nowrap" gap="xs">
								<EditButton href={ Routes.editClient(client.slug) } />
								<ScheduleButton href={ Routes.scheduleClient(client.slug) } />
							</Group>
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default ClientTable
