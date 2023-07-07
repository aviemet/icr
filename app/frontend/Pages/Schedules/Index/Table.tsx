import * as React from 'react'
import { Routes } from '@/lib'
import {
	Link,
	Table,
	Container,
} from '@/Components'
import { EditButton } from '@/Components/Button'

interface IScheduleIndexProps {
	clients: Schema.ClientsIndex[]
	// pagination: Schema.Pagination
}

const SchedulesTable = ({ clients }: IScheduleIndexProps) => {

	return (
		<Container>
			<Table.TableProvider
				model="client"
				rows={ clients }
			>
				<Table>
					<Table.Head>
						<Table.Row>
							<Table.Cell>First Name</Table.Cell>
							<Table.Cell>Last Name</Table.Cell>
							<Table.Cell style={ { textAlign: 'right', paddingRight: '1rem' } }>Actions</Table.Cell>
						</Table.Row>
					</Table.Head>

					<Table.Body>
						<Table.RowIterator render={ (client: Schema.ClientsIndex) => {
							return (
								<Table.Row key={ client.id }>
									<Table.Cell>
										<Link href={ Routes.scheduleClient(client.id) }>{ client.person.first_name }</Link>
									</Table.Cell>

									<Table.Cell><Link href={ Routes.scheduleClient(client.id) }>{ client.person.last_name }</Link></Table.Cell>

									<Table.Cell>
										<EditButton href={ ''/* Routes.editSchedule(client.id) */ } />
									</Table.Cell>
								</Table.Row>
							)
						} } />
					</Table.Body>
				</Table>
			</Table.TableProvider>
		</Container>
	)
}

export default SchedulesTable
