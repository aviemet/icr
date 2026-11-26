import { Table, Link, Presence, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface DoctorTableProps {
	records: Schema.DoctorsIndex[]
	model: string
}

export function DoctorTable({ records, model }: DoctorTableProps) {
	const columns: TableColumn<Schema.DoctorsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (doctor) => <Link href={ Routes.doctor(doctor.slug) }>{ doctor.person?.name || doctor.name }</Link>,
		},
		{
			accessor: "specialty",
			title: "Specialty",
			sortable: true,
			render: (doctor) => <Presence>{ doctor.specialty }</Presence>,
		},
		{
			accessor: "practice_name",
			title: "Practice",
			sortable: true,
			render: (doctor) => <Presence>{ doctor.practice_name }</Presence>,
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (doctor) => <EditButton href={ Routes.editDoctor(doctor.slug) } />,
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
