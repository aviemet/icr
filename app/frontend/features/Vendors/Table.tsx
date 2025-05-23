import { Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

const VendorTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="name">Name</Table.HeadCell>
					<Table.HeadCell sort="notes">Notes</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (vendor: Schema.VendorsIndex) => (
					<Table.Row key={ vendor.id }>
						<Table.Cell>
							<Link href={ Routes.vendor(vendor.id) }>{ vendor.name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.vendor(vendor.id) }>{ vendor.notes }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editVendor(vendor.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default VendorTable
