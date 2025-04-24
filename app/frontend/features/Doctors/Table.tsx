import { Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

const DoctorTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="first_name">First_name</Table.HeadCell>
					<Table.HeadCell sort="last_name">Last_name</Table.HeadCell>
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
							<EditButton href={ Routes.editDoctor(doctor.id) } />
						</Table.Cell>

					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default DoctorTable
