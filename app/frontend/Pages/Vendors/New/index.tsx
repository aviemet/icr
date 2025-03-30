import { Title, Page, Section } from "@/Components"
import VendorForm from "@/Features/Vendors/Form"
import { Routes } from "@/lib"

interface INewVendorProps {
	vendor: Schema.VendorsFormData
}

const NewVendor = ({ ...data }: INewVendorProps) => {
	const title = "New Vendor"

	return (
		<Page title={ title }>

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
