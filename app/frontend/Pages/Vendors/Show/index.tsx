import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import VendorForm from '../Form'

interface NewVendorProps {
	vendor: Schema.VendorsFormData
}

const NewVendor = ({ ...data }: NewVendorProps) => {
	const title = 'New Vendor'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Vendors', href: Routes.vendors() },
			{ title: 'New Vendor' },
		] }>

			<Section>
				<Heading>{ title }</Heading>

				<VendorForm
					to={ Routes.vendors() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewVendor
