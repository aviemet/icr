import * as React from 'react'
import { Routes } from '@/lib'
import {
	Link,
	Table,
	Container,
} from '@/Components'
import { EditButton } from '@/Components/Button'

interface IScheduleIndexProps {
	schedules: Schema.Schedule[]
	pagination: Schema.Pagination
}

const SchedulesTable = ({ schedules, pagination }: IScheduleIndexProps) => {
	return (
		<Container>
			<Table.TableProvider
				model="schedule"
				rows={ schedules }
				pagination={ pagination }
			>
				<Table>
					<Table.Head>
						<Table.Row>
							<Table.Cell>First Name</Table.Cell>
							<Table.Cell>Last Name</Table.Cell>
							<Table.Cell>Actions Name</Table.Cell>
						</Table.Row>
					</Table.Head>

					<Table.Body>

					</Table.Body>
					<Table.RowIterator render={ (schedule: Schema.Schedule) => (
						<Table.Row>
							<Table.Cell>
								<Link href={ Routes.scheduleClient(schedule.slug) }>{ schedule.f_name }</Link>
							</Table.Cell>

							<Table.Cell><Link href={ Routes.scheduleClient(schedule.slug) }>{ schedule.l_name }</Link></Table.Cell>
							<Table.Cell>
								<EditButton href={ Routes.editSchedule(schedule.id) } />
							</Table.Cell>
						</Table.Row>
					) } />
				</Table>
			</Table.TableProvider>
		</Container>
	)
}

export default SchedulesTable
