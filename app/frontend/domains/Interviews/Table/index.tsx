import { Table, Link, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

export interface EmployeeInterviewTableRecord {
	id: string
	scheduled_at?: string | number | Date
	notes?: string | number | Date
}

interface EmployeeInterviewTableProps {
	records: EmployeeInterviewTableRecord[]
	model?: string
}

export function EmployeeInterviewTable({ records, model }: EmployeeInterviewTableProps) {
	const columns: TableColumn<EmployeeInterviewTableRecord>[] = [
		{
			accessor: "scheduled_at",
			title: "Scheduled_at",
			sortable: true,
			render: (employeeInterview) => (
				<Link href={ Routes.interview(employeeInterview.id) }>
					{ String(employeeInterview.scheduled_at ?? "") }
				</Link>
			),
		},
		{
			accessor: "notes",
			title: "Notes",
			sortable: true,
			render: (employeeInterview) => (
				<Link href={ Routes.interview(employeeInterview.id) }>
					{ String(employeeInterview.notes ?? "") }
				</Link>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (employeeInterview) => <EditButton href={ Routes.editInterview(employeeInterview.id) } />,
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
