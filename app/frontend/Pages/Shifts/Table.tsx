import React from 'react'
import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const ShiftTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					
					
					
					
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (shift: Schema.ShiftsIndex) => (
					<Table.Row key={ shift.id }>
						
						
						
						
						<Table.Cell>
							<EditButton href={ Routes.editShift(shift.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default ShiftTable
