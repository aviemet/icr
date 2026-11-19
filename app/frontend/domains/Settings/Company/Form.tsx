import { Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { HiddenInput, TextInput } from "@/components/Inputs"
import { FormBand, FormBandStack } from "@/features"
import { Routes } from "@/lib"

import {
	AddressDraftFields,
	AddressFields,
	ContactAttributesList,
	PhoneDraftFields,
	PhoneFields,
} from "./ContactAttributesList"

interface CompanyFormProps {
	company: Schema.CompaniesShow
}

const emptyAddress = {
	name: "",
	address: "",
	address_2: "",
	city: "",
	region: "",
	postal: "",
	country: "",
	notes: "",
	category_id: "",
}

const emptyPhone = {
	name: "",
	number: "",
	extension: "",
	notes: "",
	category_id: "",
}

export function CompanyForm({ company }: CompanyFormProps) {
	const contact = company.contact
	const addresses = (company.addresses?.length ? company.addresses : (contact?.addresses || [])) as Record<string, unknown>[]
	const phones = (company.phones?.length ? company.phones : (contact?.phones || [])) as Record<string, unknown>[]

	return (
		<Form
			action={ Routes.settingsCompany() }
			method="patch"
			initialData={ {
				company: {
					name: company.name,
					contact_attributes: {
						id: contact?.id,
						addresses_attributes: addresses,
						phones_attributes: phones,
					},
				},
			} }
		>
			{ contact?.id != null && (
				<HiddenInput name="company.contact_attributes.id" defaultValue={ String(contact.id) } />
			) }
			<FormBandStack>
				<FormBand
					title="Company"
					description="Legal or display name for the organization."
				>
					<TextInput
						name="company.name"
						label="Company Name"
						required
					/>
				</FormBand>

				<ContactAttributesList
					basePath="company.contact_attributes.addresses_attributes"
					title="Addresses"
					addLabel="Add address"
					emptyLabel="No addresses yet."
					initialItems={ addresses }
					emptyData={ emptyAddress }
					draftFields={ AddressDraftFields }
				>
					{ (_index, namePrefix) => <AddressFields namePrefix={ namePrefix } /> }
				</ContactAttributesList>

				<ContactAttributesList
					basePath="company.contact_attributes.phones_attributes"
					title="Phone numbers"
					addLabel="Add phone"
					emptyLabel="No phone numbers yet."
					initialItems={ phones }
					emptyData={ emptyPhone }
					draftFields={ PhoneDraftFields }
				>
					{ (_index, namePrefix) => <PhoneFields namePrefix={ namePrefix } /> }
				</ContactAttributesList>

				<Stack>
					<Submit>Update company</Submit>
				</Stack>
			</FormBandStack>
		</Form>
	)
}
