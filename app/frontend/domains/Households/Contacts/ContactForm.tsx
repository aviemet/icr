import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { DynamicFields, Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"
import { Routes } from "@/lib"

interface HouseholdContactFormProps {
	household: Schema.HouseholdsShow
}

export function HouseholdContactForm({ household }: HouseholdContactFormProps) {
	const { t } = useTranslation()
	const contact = household.contact
	const phones = contact?.phones ?? []
	const emails = contact?.emails ?? []
	const addresses = contact?.addresses ?? []

	return (
		<Form
			action={ Routes.household(household.slug) }
			method="put"
			initialData={ {
				tab: "contacts",
				household: {
					contact: {
						id: contact?.id,
						phones,
						emails,
						addresses,
					},
				},
			} }
		>
			<Stack gap="md">
				<DynamicFields
					basePath="household.contact.phones"
					initialCount={ phones.length }
					label={ t("views.households.show.contacts.phones") }
					emptyData={ { name: "", number: "", extension: "", notes: "", category_id: "" } }
				>
					{ (_index, namePrefix) => (
						<Stack gap="xs">
							<TextInput name={ `${namePrefix}.number` } label="Number" />
							<TextInput name={ `${namePrefix}.name` } label="Label" />
							<CategoriesDropdown
								name={ `${namePrefix}.category_id` }
								categoryType="Contact::Phone"
								label="Category"
							/>
						</Stack>
					) }
				</DynamicFields>

				<DynamicFields
					basePath="household.contact.emails"
					initialCount={ emails.length }
					label={ t("views.households.show.contacts.emails") }
					emptyData={ { name: "", email: "", notes: "", category_id: "" } }
				>
					{ (_index, namePrefix) => (
						<Stack gap="xs">
							<TextInput name={ `${namePrefix}.email` } label="Email" />
							<TextInput name={ `${namePrefix}.name` } label="Label" />
							<CategoriesDropdown
								name={ `${namePrefix}.category_id` }
								categoryType="Contact::Email"
								label="Category"
							/>
						</Stack>
					) }
				</DynamicFields>

				<DynamicFields
					basePath="household.contact.addresses"
					initialCount={ addresses.length }
					label={ t("views.households.show.contacts.addresses") }
					emptyData={ {
						name: "",
						address: "",
						address_2: "",
						city: "",
						region: "",
						postal: "",
						country: "",
						notes: "",
						category_id: "",
					} }
				>
					{ (_index, namePrefix) => (
						<Stack gap="xs">
							<TextInput name={ `${namePrefix}.address` } label="Address" />
							<TextInput name={ `${namePrefix}.address_2` } label="Address line 2" />
							<TextInput name={ `${namePrefix}.city` } label="City" />
							<TextInput name={ `${namePrefix}.region` } label="State / Region" />
							<TextInput name={ `${namePrefix}.postal` } label="Postal code" />
							<CategoriesDropdown
								name={ `${namePrefix}.category_id` }
								categoryType="Contact::Address"
								label="Category"
							/>
						</Stack>
					) }
				</DynamicFields>

				<Submit>{ t("views.households.show.contacts.save") }</Submit>
			</Stack>
		</Form>
	)
}
