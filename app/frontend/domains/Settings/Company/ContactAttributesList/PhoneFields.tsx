import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"

export interface PhoneFieldsProps {
	namePrefix: string
}

export function PhoneFields({ namePrefix }: PhoneFieldsProps) {
	const { t } = useTranslation()

	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 5 } }>
				<TextInput
					name={ `${namePrefix}.number` }
					label={ t("views.settings.company.fields.number") }
					required
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 3 } }>
				<TextInput
					name={ `${namePrefix}.extension` }
					label={ t("views.settings.company.fields.extension") }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<CategoriesDropdown
					name={ `${namePrefix}.category_id` }
					categoryType="Contact::Phone"
					label={ t("views.settings.company.fields.category") }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput
					name={ `${namePrefix}.name` }
					label={ t("views.settings.company.fields.label") }
				/>
			</Grid.Col>
		</Grid>
	)
}
