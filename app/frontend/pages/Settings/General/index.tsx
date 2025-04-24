import { Box, Grid } from "@/components"
import { Form, Submit, TextInput } from "@/components/Form"
import {
	FormCurrenciesDropdown,
	FormLanguagesDropdown,
	// FormPayPeriodsDropdown,
	FormTimezonesDropdown,
} from "@/features/Dropdowns"
import { Routes, withLayout } from "@/lib"

import ShiftTitleFormatInput from "./ShiftTitleFormatInput"

export type GeneralSettingsFormData = {
	settings: Schema.Setting
}

interface GeneralSettingsProps {
	settings: Schema.Setting
}

const GeneralSettings = ({ settings }: GeneralSettingsProps) => {
	return (
		<Box>
			<Form<GeneralSettingsFormData>
				to={ Routes.settings() }
				model="settings"
				method="patch"
				data={ { settings } }
				remember={ false }
			>
				<Grid>
					<Grid.Col>
						<TextInput
							label="Company Name"
							name="company_name"
						/>
					</Grid.Col>

					<Grid.Col>
						<FormLanguagesDropdown
							label="Default Language"
							name="default_language"
						/>
					</Grid.Col>

					<Grid.Col>
						<FormCurrenciesDropdown
							label="Default Currency"
							name="default_currency"
						/>
					</Grid.Col>

					<Grid.Col>
						<FormTimezonesDropdown
							label="Default Timezone"
							name="default_timezone"
						/>
					</Grid.Col>

					<Grid.Col>
						<Submit>Update Settings</Submit>
					</Grid.Col>
				</Grid>
			</Form>
		</Box>
	)
}

export default withLayout(GeneralSettings, "settings")
