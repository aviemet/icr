import { Stack } from "@/components"
import { DynamicFields, Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"
import { Routes } from "@/lib"

interface EmployeeContactFormProps {
	employee: Schema.EmployeesShow
}

export function EmployeeContactForm({ employee }: EmployeeContactFormProps) {
	const contact = employee.person.contact
	const phones = contact?.phones ?? []
	const emails = contact?.emails ?? []
	const addresses = contact?.addresses ?? []

	return (
		<Form
			action={ Routes.employee(employee.slug) }
			method="put"
			initialData={ {
				tab: "contacts",
				employee: {
					person: {
						id: employee.person.id,
						contact: {
							id: contact?.id,
							phones,
							emails,
							addresses,
						},
					},
				},
			} }
		>
			<Stack gap="md">
				<DynamicFields
					basePath="employee.person.contact.phones"
					initialCount={ phones.length }
					label="Phone Numbers"
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
					basePath="employee.person.contact.emails"
					initialCount={ emails.length }
					label="Emails"
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
					basePath="employee.person.contact.addresses"
					initialCount={ addresses.length }
					label="Addresses"
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

				<Submit>Save Contact Details</Submit>
			</Stack>
		</Form>
	)
}
