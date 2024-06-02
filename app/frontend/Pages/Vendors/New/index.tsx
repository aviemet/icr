import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import VendorForm from '../Form'

interface INewVendorProps {
	vendor: Schema.VendorsFormData
}

const NewVendor = ({ ...data }: INewVendorProps) => {
	const title = 'New Vendor'

	return (
		<Page title={ title }>

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
