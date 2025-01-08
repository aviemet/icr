import { Routes } from '@/lib'
import { Table, Link } from '@/Components'
import { EditButton } from '@/Components/Button'
import { type TableProps } from '@/Components/Table/Table'

const DosageTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="amount">Amount</Table.HeadCell>
					<Table.HeadCell sort="amount_unit">Amount_unit</Table.HeadCell>
					<Table.HeadCell sort="freq_amount">Freq_amount</Table.HeadCell>
					<Table.HeadCell sort="freq_period">Freq_period</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (dosage: Schema.DosagesIndex) => (
					<Table.Row key={ dosage.id }>
						<Table.Cell>
							<Link href={ Routes.dosage(dosage.id) }>{ dosage.amount }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.dosage(dosage.id) }>{ dosage.amount_unit }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.dosage(dosage.id) }>{ dosage.freq_amount }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.dosage(dosage.id) }>{ dosage.freq_period }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.dosage(dosage.id) }>{ dosage.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editDosage(dosage.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default DosageTable
