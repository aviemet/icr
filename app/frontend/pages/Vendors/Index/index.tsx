import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { VendorTable } from "@/features/Vendors/Table"
import { Routes } from "@/lib"

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
			<VendorTable />
		</IndexPageTemplate>
	)
}

export default VendorsIndex
