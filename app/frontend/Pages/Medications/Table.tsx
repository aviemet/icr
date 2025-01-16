import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const MedicationTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="name">Name</Table.HeadCell>
					<Table.HeadCell sort="generic_name">Generic_name</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (medication: Schema.MedicationsIndex) => (
					<Table.Row key={ medication.id }>
						<Table.Cell>
							<Link href={ Routes.medication(medication.id) }>{ medication.name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.medication(medication.id) }>{ medication.generic_name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.medication(medication.id) }>{ medication.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editMedication(medication.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default MedicationTable
