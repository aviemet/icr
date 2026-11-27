import {DataTable, Link, Presence, type TableColumn} from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface VendorTableProps {
	records: Schema.VendorsIndex[]
	model: string
}

export function VendorTable({ records, model }: VendorTableProps) {
	const columns: TableColumn<Schema.VendorsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (vendor) => <Link href={ Routes.vendor(vendor.slug) }>{ vendor.name }</Link>,
		},
		{
			accessor: "notes",
			title: "Notes",
			sortable: true,
			render: (vendor) => (
				<Link href={ Routes.vendor(vendor.slug) }>
					<Presence>{ vendor.notes }</Presence>
				</Link>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (vendor) => <EditButton href={ Routes.editVendor(vendor.slug) } />,
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
