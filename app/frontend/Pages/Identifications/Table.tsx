import React from 'react'
import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const IdentificationTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					
					<Table.HeadCell sort="type">Type</Table.HeadCell>
					<Table.HeadCell sort="number">Number</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell sort="issued_at">Issued_at</Table.HeadCell>
					<Table.HeadCell sort="expires_at">Expires_at</Table.HeadCell>
					<Table.HeadCell sort="extra_fields">Extra_fields</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (identification: Schema.IdentificationsIndex) => (
					<Table.Row key={ identification.id }>
						
						<Table.Cell>
							<Link href={ Routes.identification(identification.id) }>{ identification.type }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.identification(identification.id) }>{ identification.number }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.identification(identification.id) }>{ identification.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.identification(identification.id) }>{ identification.issued_at }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.identification(identification.id) }>{ identification.expires_at }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.identification(identification.id) }>{ identification.extra_fields }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editIdentification(identification.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default IdentificationTable
