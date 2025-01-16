import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import VendorsForm from "../Form"

interface EditVendorProps {
	vendor: Schema.VendorsEdit
}

const EditVendor = ({ vendor }: EditVendorProps) => {
	const title = "Edit Vendor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Vendors", href: Routes.vendors() },
			{ title: Vendor, href: Routes.vendor(vendor.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>

				<VendorsForm
					method='put'
					to={ Routes.vendor() }
					vendor={ vendor }
				/>
			</Section>
		</Page>
	)
}

export default EditVendor
