import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"

export interface AddressFieldsProps {
	namePrefix: string
}

export function AddressFields({ namePrefix }: AddressFieldsProps) {
	return (
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
	)
}
