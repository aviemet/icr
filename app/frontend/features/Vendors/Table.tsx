import { Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface VendorTableProps {
	records: Schema.VendorsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function VendorTable({ records, pagination, model }: VendorTableProps) {
	const columns: TableColumn<Schema.VendorsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (vendor) => <Link href={ Routes.vendor(vendor.id) }>{ vendor.name }</Link>,
		},
		{
			accessor: "notes",
			title: "Notes",
			sortable: true,
			render: (vendor) => <Link href={ Routes.vendor(vendor.id) }>{ vendor.notes }</Link>,
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (vendor) => <EditButton href={ Routes.editVendor(vendor.id) } />,
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
