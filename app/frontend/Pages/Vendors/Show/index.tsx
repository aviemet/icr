import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import VendorForm from "../Form"

interface NewVendorProps {
	vendor: Schema.VendorsFormData
}

const NewVendor = ({ ...data }: NewVendorProps) => {
	const title = "New Vendor"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Vendors", href: Routes.vendors() },
			{ title: "New Vendor" },
		] }>

			<Section>
				<Title>{ title }</Title>

				<VendorForm
					to={ Routes.vendors() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewVendor
