import { Title, Page, Section } from "@/components"
import { VendorForm } from "@/domains/Vendors/Form"
import { Routes } from "@/lib"

interface EditVendorProps {
	vendor: Schema.VendorsEdit
}

const EditVendor = ({ vendor }: EditVendorProps) => {
	const title = "Edit Vendor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Vendors", href: Routes.vendors() },
			{ title: title, href: Routes.vendor(vendor.slug) },
			{ title },
		] }>
			<Section>
				<Title>{ title }</Title>

				<VendorForm
					method="put"
					to={ Routes.vendor(vendor.slug) }
					vendor={ vendor }
				/>
			</Section>
		</Page>
	)
}

export default EditVendor
