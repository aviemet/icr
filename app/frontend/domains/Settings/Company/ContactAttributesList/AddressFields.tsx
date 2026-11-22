import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { TextInput } from "@/components/Inputs"
import { CategoriesDropdown } from "@/components/Inputs/Dropdowns"

export interface AddressFieldsProps {
	namePrefix: string
}

export function AddressFields({ namePrefix }: AddressFieldsProps) {
	const { t } = useTranslation()

	return (
		<Grid>
			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput
					name={ `${namePrefix}.address` }
					label={ t("views.settings.company.fields.address") }
					required
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<TextInput
					name={ `${namePrefix}.address_2` }
					label={ t("views.settings.company.fields.address_2") }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					name={ `${namePrefix}.city` }
					label={ t("views.settings.company.fields.city") }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					name={ `${namePrefix}.region` }
					label={ t("views.settings.company.fields.region") }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 4 } }>
				<TextInput
					name={ `${namePrefix}.postal` }
					label={ t("views.settings.company.fields.postal") }
				/>
			</Grid.Col>

			<Grid.Col span={ { xs: 12, sm: 6 } }>
				<CategoriesDropdown
					name={ `${namePrefix}.category_id` }
					categoryType="Contact::Address"
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
