import { Table, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface TimesheetTableProps {
	records: Schema.TimesheetsIndex[]
	pagination?: Schema.Pagination
	model?: string
}

export function TimesheetTable({ records, pagination, model }: TimesheetTableProps) {
	const columns: TableColumn<Schema.TimesheetsIndex>[] = [
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (timesheet) => <EditButton href={ Routes.editTimesheet(timesheet.id) } />,
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
