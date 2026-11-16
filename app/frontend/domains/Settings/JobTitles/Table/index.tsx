import { Link, Table, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface JobTitleTableProps {
	records: Schema.EmployeeJobTitlesIndex[]
	pagination: Schema.Pagination
	model: string
}

export function JobTitleTable({ records, pagination, model }: JobTitleTableProps) {
	const columns: TableColumn<Schema.EmployeeJobTitlesIndex>[] = [
		{
			accessor: "name",
			title: "Title",
			sortable: true,
			render: (jobTitle) => (
				<Link href={ Routes.settingsJobTitle(String(jobTitle.slug)) }>
					{ String(jobTitle.name ?? "") }
				</Link>
			),
		},
		{
			accessor: "department",
			title: "Department",
			sortable: false,
			render: (jobTitle) => String(jobTitle.department?.name ?? "—"),
		},
		{
			accessor: "description",
			title: "Description",
			sortable: true,
			render: (jobTitle) => (
				<Link href={ Routes.settingsJobTitle(String(jobTitle.slug)) }>
					{ String(jobTitle.description ?? "") }
				</Link>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (jobTitle) => (
				<EditButton href={ Routes.editSettingsJobTitle(String(jobTitle.slug)) } />
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
