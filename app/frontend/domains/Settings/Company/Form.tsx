import { useTranslation } from "react-i18next"

import { Form } from "@/components/Form"
import { HiddenInput, TextInput } from "@/components/Inputs"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
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
	const { t } = useTranslation()
	const contact = company.contact
	const addresses = company.addresses?.length ? company.addresses : (contact?.addresses || [])
	const phones = company.phones?.length ? company.phones : (contact?.phones || [])

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
			<SettingsPageHeader
				title={ t("views.settings.company.title") }
				description={ t("views.settings.company.description") }
				actions={ (
					<SettingsSaveButton>
						{ t("views.settings.company.save") }
					</SettingsSaveButton>
				) }
			/>

			{ contact?.id !== undefined && (
				<HiddenInput name="company.contact_attributes.id" defaultValue={ String(contact.id) } />
			) }
			<FormBandStack>
				<FormBand
					title={ t("views.settings.company.name_band_title") }
					description={ t("views.settings.company.name_band_description") }
				>
					<TextInput
						name="company.name"
						label={ t("views.settings.company.name_label") }
						required
					/>
				</FormBand>

				<ContactAttributesList
					basePath="company.contact_attributes.addresses_attributes"
					title={ t("views.settings.company.addresses_title") }
					addLabel={ t("views.settings.company.addresses_add") }
					emptyLabel={ t("views.settings.company.addresses_empty") }
					initialItems={ addresses }
					emptyData={ emptyAddress }
					draftFields={ AddressDraftFields }
				>
					{ (_index, namePrefix) => <AddressFields namePrefix={ namePrefix } /> }
				</ContactAttributesList>

				<ContactAttributesList
					basePath="company.contact_attributes.phones_attributes"
					title={ t("views.settings.company.phones_title") }
					addLabel={ t("views.settings.company.phones_add") }
					emptyLabel={ t("views.settings.company.phones_empty") }
					initialItems={ phones }
					emptyData={ emptyPhone }
					draftFields={ PhoneDraftFields }
				>
					{ (_index, namePrefix) => <PhoneFields namePrefix={ namePrefix } /> }
				</ContactAttributesList>
			</FormBandStack>
		</Form>
	)
}
