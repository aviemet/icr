import { Divider, Grid, Stack, Text, Title } from "@/components"
import { DynamicFields, Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"
import { Routes } from "@/lib"

interface CompanyFormProps {
	company: Schema.CompaniesShow
}

export function CompanyForm({ company }: CompanyFormProps) {
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
			<Stack gap="xl">
				<Grid>
					<Grid.Col span={ { xs: 12, sm: 6 } }>
						<TextInput
							name="company.name"
							label="Company Name"
							required
						/>
					</Grid.Col>
				</Grid>

				<Divider />

				<Stack gap="md">
					<Title order={ 4 }>Addresses</Title>
					<Text size="sm" c="dimmed">Business locations for the company.</Text>
					<DynamicFields
						basePath="company.contact_attributes.addresses_attributes"
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
							<Grid>
								<Grid.Col span={ { xs: 12, sm: 6 } }>
									<TextInput name={ `${namePrefix}.address` } label="Address" required />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 6 } }>
									<TextInput name={ `${namePrefix}.address_2` } label="Address line 2" />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 4 } }>
									<TextInput name={ `${namePrefix}.city` } label="City" />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 4 } }>
									<TextInput name={ `${namePrefix}.region` } label="State / Region" />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 4 } }>
									<TextInput name={ `${namePrefix}.postal` } label="Postal code" />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 6 } }>
									<CategoriesDropdown
										name={ `${namePrefix}.category_id` }
										categoryType="Contact::Address"
										label="Category"
									/>
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 6 } }>
									<TextInput name={ `${namePrefix}.name` } label="Label" />
								</Grid.Col>
							</Grid>
						) }
					</DynamicFields>
				</Stack>

				<Divider />

				<Stack gap="md">
					<Title order={ 4 }>Phone numbers</Title>
					<Text size="sm" c="dimmed">Main phone contacts for the company.</Text>
					<DynamicFields
						basePath="company.contact_attributes.phones_attributes"
						initialCount={ phones.length }
						label="Phones"
						emptyData={ {
							name: "",
							number: "",
							extension: "",
							notes: "",
							category_id: "",
						} }
					>
						{ (_index, namePrefix) => (
							<Grid>
								<Grid.Col span={ { xs: 12, sm: 5 } }>
									<TextInput name={ `${namePrefix}.number` } label="Number" required />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 3 } }>
									<TextInput name={ `${namePrefix}.extension` } label="Extension" />
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 4 } }>
									<CategoriesDropdown
										name={ `${namePrefix}.category_id` }
										categoryType="Contact::Phone"
										label="Category"
									/>
								</Grid.Col>
								<Grid.Col span={ { xs: 12, sm: 6 } }>
									<TextInput name={ `${namePrefix}.name` } label="Label" />
								</Grid.Col>
							</Grid>
						) }
					</DynamicFields>
				</Stack>

				<Submit>Update company</Submit>
			</Stack>
		</Form>
	)
}
