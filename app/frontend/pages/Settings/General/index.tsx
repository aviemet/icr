import { Box, Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import {
	CurrenciesDropdown,
	LanguagesDropdown,
	TimezonesDropdown,
} from "@/components/Inputs/Dropdowns"
import { Routes, withLayout } from "@/lib"

interface GeneralSettingsProps {
	settings: Schema.Setting
}

const GeneralSettings = ({ settings }: GeneralSettingsProps) => {
	return (
		<Box>
			<Form
				action={ Routes.settings() }
				method="patch"
				initialData={ { settings } }
			>
				<Grid>
					<Grid.Col>
						<TextInput
							label="Company Name"
							name="settings.company_name"
						/>
					</Grid.Col>

					<Grid.Col>
						<LanguagesDropdown
							label="Default Language"
							name="settings.default_language"
						/>
					</Grid.Col>

					<Grid.Col>
						<CurrenciesDropdown
							label="Default Currency"
							name="settings.default_currency"
						/>
					</Grid.Col>

					<Grid.Col>
						<TimezonesDropdown
							label="Default Timezone"
							name="settings.default_timezone"
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
