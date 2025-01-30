import { Routes } from "@/lib"
import { IndexPageTemplate } from "@/Features"
import { NewIcon } from "@/Components/Icons"
import VendorsTable from "@/Features/Vendors/Table"

interface VendorIndexProps {
	vendors: Schema.VendorsIndex[]
	pagination: Schema.Pagination
}

const VendorsIndex = ({ vendors, pagination }: VendorIndexProps) => {
	return (
		<IndexPageTemplate
			title="Vendors"
			model="vendors"
			rows={ vendors }
			pagination={ pagination }
			deleteRoute={ Routes.vendors() }
			menuOptions={ [
				{ label: "New Vendor", href: Routes.newVendor(), icon: <NewIcon /> },
			] }
		>
			<VendorsTable />
		</IndexPageTemplate>
	)
}

export default VendorsIndex
