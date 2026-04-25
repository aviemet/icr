import { NewIcon } from "@/components/Icons"
import { VendorTable } from "@/domains/Vendors/Table"
import { IndexPageTemplate } from "@/features"
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
			pagination={ pagination }
			deleteRoute={ Routes.vendors() }
			menuOptions={ [
				{ label: "New Vendor", href: Routes.newVendor(), icon: <NewIcon /> },
			] }
		>
			<VendorTable records={ vendors } pagination={ pagination } model="vendors" />
		</IndexPageTemplate>
	)
}

export default VendorsIndex
