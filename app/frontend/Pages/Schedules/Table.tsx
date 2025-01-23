import * as React from "react"
import { Routes } from "@/lib"
import { Box, Link, Paper, Table } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"


const ScheduleTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.Cell>First Name</Table.Cell>
					<Table.Cell>Last Name</Table.Cell>
					<Table.Cell className="actions">Actions</Table.Cell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (client: Schema.ClientsIndex) => (
					<Table.Row key={ client.id }>
						<Table.Cell><Link href={ Routes.scheduleClient(client.slug) }>{ client.first_name }</Link></Table.Cell>
						<Table.Cell>{ client.last_name }</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editClient(client.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default ScheduleTable
