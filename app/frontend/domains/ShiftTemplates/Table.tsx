import {DataTable, Link, type TableColumn} from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ShiftTemplateTableProps {
	records: Schema.ShiftTemplatesIndex[]
	model?: string
}

export function ShiftTemplateTable({ records, model }: ShiftTemplateTableProps) {
	const columns: TableColumn<Schema.ShiftTemplatesIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (shiftTemplate) => <Link href={ Routes.shiftTemplate(shiftTemplate.id) }>{ shiftTemplate.name }</Link>,
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (shiftTemplate) => <EditButton href={ Routes.editShiftTemplate(shiftTemplate.id) } />,
		},
	]

	return (
		<DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
