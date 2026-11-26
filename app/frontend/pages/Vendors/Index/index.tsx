import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { VendorTable } from "@/domains/Vendors/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

interface VendorIndexProps {
	vendors: Schema.VendorsIndex[]
	pagination: Schema.Pagination
}

const VendorsIndex = ({ vendors, pagination }: VendorIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.vendors.index.title") }
			model="vendors"
			pagination={ pagination }
			deleteRoute={ Routes.vendors() }
			dense
			actions={ [
				{ label: t("views.vendors.index.new"), href: Routes.newVendor(), icon: <NewIcon /> },
			] }
		>
			<VendorTable records={ vendors } model="vendors" />
		</IndexPageTemplate>
	)
}

export default VendorsIndex
