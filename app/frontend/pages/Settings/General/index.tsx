import { Box, Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { BrandColorInput } from "@/components/Inputs/BrandColorInput"
import {
	CurrenciesDropdown,
	LanguagesDropdown,
	TimezonesDropdown,
} from "@/components/Inputs/Dropdowns"
import { FormBand, FormBandStack } from "@/features"
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
				<FormBandStack>
					<FormBand
						title="Locale"
						description="Defaults used across the application."
					>
						<Stack gap="sm">
							<LanguagesDropdown
								label="Default Language"
								name="settings.default_language"
							/>
							<CurrenciesDropdown
								label="Default Currency"
								name="settings.default_currency"
							/>
							<TimezonesDropdown
								label="Default Timezone"
								name="settings.default_timezone"
							/>
						</Stack>
					</FormBand>

					<FormBand
						title="Brand"
						description="Primary accent used in navigation and panels."
					>
						<BrandColorInput
							label="Primary color"
							name="settings.primary_color"
							initialValue={ settings.primary_color || DEFAULT_BRAND_COLOR }
						/>
					</FormBand>

					<Submit>Update Settings</Submit>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(GeneralSettings, "settings")
