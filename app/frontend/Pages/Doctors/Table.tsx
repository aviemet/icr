import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const DoctorTable = (props: TableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="first_name">First_name</Table.HeadCell>
					<Table.HeadCell sort="last_name">Last_name</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (doctor: Schema.DoctorsIndex) => (
					<Table.Row key={ doctor.id }>
						<Table.Cell>
							<Link href={ Routes.doctor(doctor.id) }>{ doctor.first_name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.doctor(doctor.id) }>{ doctor.last_name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.doctor(doctor.id) }>{ doctor.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editDoctor(doctor.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default DoctorTable
