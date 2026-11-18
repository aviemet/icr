import { Box, Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { BrandColorInput } from "@/components/Inputs/BrandColorInput"
import {
	CurrenciesDropdown,
	LanguagesDropdown,
	TimezonesDropdown,
} from "@/components/Inputs/Dropdowns"
import { Routes, withLayout } from "@/lib"
import { DEFAULT_BRAND_COLOR } from "@/lib/brandColor"

import { SettingsPageHeader } from "../SettingsPageHeader"

interface GeneralSettingsProps {
	settings: Schema.Setting
}

const GeneralSettings = ({ settings }: GeneralSettingsProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="General"
				description="Locale defaults and site brand color."
			/>

			<Form
				action={ Routes.settings() }
				method="patch"
				initialData={ { settings } }
			>
				<Grid>
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
						<BrandColorInput
							label="Primary color"
							name="settings.primary_color"
							initialValue={ settings.primary_color || DEFAULT_BRAND_COLOR }
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
