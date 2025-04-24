import { Title, Page, Section } from "@/components"
import VendorsForm from "@/features/Vendors/Form"
import { Routes } from "@/lib"

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
					method="put"
					to={ Routes.vendor(vendor.id) }
					vendor={ vendor }
				/>
			</Section>
		</Page>
	)
}

export default EditVendor
