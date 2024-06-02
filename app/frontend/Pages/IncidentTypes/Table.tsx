import React from 'react'
import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const IncidentTypeTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					
					<Table.HeadCell sort="name">Name</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (incident_type: Schema.IncidentTypesIndex) => (
					<Table.Row key={ incident_type.id }>
						
						<Table.Cell>
							<Link href={ Routes.incidentType(incident_type.id) }>{ incident_type.name }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editIncidentType(incident_type.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default IncidentTypeTable
