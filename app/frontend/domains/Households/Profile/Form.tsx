import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import {
	DefinitionItem,
	DefinitionList,
	FormBand,
	FormBandStack,
	ShowEditToggle,
} from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface HouseholdProfileFormProps {
	household: Schema.HouseholdsShow
}

export function HouseholdProfileForm({ household }: HouseholdProfileFormProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()

	return (
		<ShowEditToggle canUpdate={ canUpdate }>
			{ ({ editing, controls }) => editing
				? (
					<Form
						action={ Routes.household(household.slug) }
						method="put"
						initialData={ {
							tab: "profile",
							household: {
								name: household.name,
							},
						} }
					>
						<FormBandStack>
							<FormBand title={ t("views.households.form.household_details") }>
								<Grid>
									<Grid.Col span={ { xxs: 12, sm: 6 } }>
										<TextInput
											name="household.name"
											label={ t("views.households.show.profile.name") }
											required
										/>
									</Grid.Col>
								</Grid>
							</FormBand>
						</FormBandStack>
						{ controls }
						<Submit>{ t("views.households.form.update") }</Submit>
					</Form>
				)
				: (
					<DefinitionList>
						<DefinitionItem
							label={ t("views.households.show.profile.name") }
							value={ household.name }
						/>
					</DefinitionList>
				) }
		</ShowEditToggle>
	)
}
