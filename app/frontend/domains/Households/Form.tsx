import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { HomeIcon } from "@/components/Icons"
import { TextInput } from "@/components/Inputs"
import { FormBand, FormBandStack } from "@/features"
import { type HTTPVerb } from "@/lib"

type THouseholdFormData = {
	household: Schema.HouseholdsFormData | Schema.HouseholdsEdit
}

export interface HouseholdFormProps {
	to: string
	method?: HTTPVerb
	household: Schema.HouseholdsFormData | Schema.HouseholdsEdit
}

export function HouseholdForm({ method = "post", to, household, ...props }: HouseholdFormProps) {
	const { t } = useTranslation()
	const isPersisted = Boolean(household.id)

	return (
		<Form<THouseholdFormData>
			action={ to }
			initialData={ { household } }
			method={ method }
			{ ...props }
		>
			<FormBandStack>
				<FormBand
					title={ t("views.households.form.household_details") }
					description={ t("views.households.form.household_details_description") }
					icon={ <HomeIcon size={ 16 } /> }
				>
					<Grid>
						<Grid.Col span={ { xxs: 12, sm: 6 } }>
							<TextInput
								name="household.name"
								label={ t("views.households.form.name") }
								required
							/>
						</Grid.Col>
					</Grid>
				</FormBand>
			</FormBandStack>

			<Submit>
				{ isPersisted
					? t("views.households.form.update")
					: t("views.households.form.create") }
			</Submit>
		</Form>
	)
}
