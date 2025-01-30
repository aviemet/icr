import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import VendorsForm from "@/Features/Vendors/Form"

interface EditVendorProps {
	vendor: Schema.VendorsEdit
}

const EditVendor = ({ vendor }: EditVendorProps) => {
	const title = "Edit Vendor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Vendors", href: Routes.vendors() },
			{ title: title, href: Routes.vendor(vendor.id) },
			{ title },
		] }>
			<Section>
				<Title>{ title }</Title>

				<VendorsForm
					method='put'
					to={ Routes.vendor(vendor.id) }
					vendor={ vendor }
				/>
			</Section>
		</Page>
	)
}

export default EditVendor
