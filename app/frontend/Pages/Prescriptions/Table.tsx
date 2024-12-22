import React from 'react'
import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const PrescriptionTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					
					
					<Table.HeadCell sort="start_at">Start_at</Table.HeadCell>
					<Table.HeadCell sort="ends_at">Ends_at</Table.HeadCell>
					
					
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (prescription: Schema.PrescriptionsIndex) => (
					<Table.Row key={ prescription.id }>
						
						
						<Table.Cell>
							<Link href={ Routes.prescription(prescription.id) }>{ prescription.start_at }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.prescription(prescription.id) }>{ prescription.ends_at }</Link>
						</Table.Cell>
						
						
						<Table.Cell>
							<EditButton href={ Routes.editPrescription(prescription.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default PrescriptionTable
