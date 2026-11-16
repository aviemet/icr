import { Link, Table, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface DepartmentTableProps {
	records: Schema.EmployeeDepartmentsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function DepartmentTable({ records, pagination, model }: DepartmentTableProps) {
	const columns: TableColumn<Schema.EmployeeDepartmentsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (department) => (
				<Link href={ Routes.settingsDepartment(String(department.slug)) }>
					{ String(department.name ?? "") }
				</Link>
			),
		},
		{
			accessor: "description",
			title: "Description",
			sortable: true,
			render: (department) => (
				<Link href={ Routes.settingsDepartment(String(department.slug)) }>
					{ String(department.description ?? "") }
				</Link>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (department) => (
				<EditButton href={ Routes.editSettingsDepartment(String(department.slug)) } />
			),
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
