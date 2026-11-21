import { Table, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface TimesheetTableProps {
	records: Schema.TimesheetsIndex[]
	model?: string
}

export function TimesheetTable({ records, model }: TimesheetTableProps) {
	const columns: TableColumn<Schema.TimesheetsIndex>[] = [
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (timesheet) => <EditButton href={ Routes.editTimesheet(timesheet.id) } />,
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
