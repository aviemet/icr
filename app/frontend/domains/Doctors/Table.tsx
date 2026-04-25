import { Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface DoctorTableProps {
	records: Schema.DoctorsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function DoctorTable({ records, pagination, model }: DoctorTableProps) {
	const columns: TableColumn<Schema.DoctorsIndex>[] = [
		{
			accessor: "first_name",
			title: "First_name",
			sortable: true,
			render: (doctor) => <Link href={ Routes.doctor(doctor.id) }>{ doctor.first_name }</Link>,
		},
		{
			accessor: "last_name",
			title: "Last_name",
			sortable: true,
			render: (doctor) => <Link href={ Routes.doctor(doctor.id) }>{ doctor.last_name }</Link>,
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (doctor) => <EditButton href={ Routes.editDoctor(doctor.id) } />,
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			pagination={ pagination }
			model={ model }
			selectable
		/>
	)
}
