import { Routes } from "@/lib"
import { Box, Grid } from "@/Components"
import { Form, Submit, TextInput } from "@/Components/Form"
import {
	FormCurrenciesDropdown,
	FormLanguagesDropdown,
	FormPayPeriodsDropdown,
	FormTimezonesDropdown,
} from "@/Features/Dropdowns"
import ShiftTitleFormatInput from "../../../Features/Settings/ShiftTitleFormatInput"

export type GeneralSettingsFormData = {
	setting: Schema.Setting
}

interface GeneralSettingsProps {
	settings: Schema.Setting
}

const General = ({ settings }: GeneralSettingsProps) => {
	return (
		<Box>
			<Form<GeneralSettingsFormData>
				to={ Routes.settings() }
				model="setting"
				method="patch"
				data={ { setting: settings } }
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
						<FormPayPeriodsDropdown
							label="Pay Period Type"
							name="pay_period_type"
						/>
					</Grid.Col>

					<Grid.Col>
						<ShiftTitleFormatInput settings={ settings } />
					</Grid.Col>

					<Grid.Col>
						<Submit>Update Settings</Submit>
					</Grid.Col>
				</Grid>
			</Form>
		</Box>
	)
}

export default General
