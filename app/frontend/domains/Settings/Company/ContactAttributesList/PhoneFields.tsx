import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"

export interface PhoneFieldsProps {
	namePrefix: string
}

export function PhoneFields({ namePrefix }: PhoneFieldsProps) {
	return (
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
	)
}
