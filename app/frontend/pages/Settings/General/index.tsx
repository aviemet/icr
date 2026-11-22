import { useTranslation } from "react-i18next"

import { Box, Stack } from "@/components"
import { Form } from "@/components/Form"
import { BrandColorInput } from "@/components/Inputs/BrandColorInput"
import {
	CurrenciesDropdown,
	LanguagesDropdown,
	TimezonesDropdown,
} from "@/components/Inputs/Dropdowns"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"
import { DEFAULT_BRAND_COLOR } from "@/lib/brandColor"

interface GeneralSettingsProps {
	settings: Schema.Setting
}

const GeneralSettings = ({ settings }: GeneralSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Form
				action={ Routes.settings() }
				method="patch"
				initialData={ { settings } }
			>
				<SettingsPageHeader
					title={ t("views.settings.general.title") }
					description={ t("views.settings.general.description") }
					actions={ <SettingsSaveButton /> }
				/>

				<FormBandStack>
					<FormBand
						title={ t("views.settings.general.locale_band_title") }
						description={ t("views.settings.general.locale_band_description") }
					>
						<Stack gap="sm">
							<LanguagesDropdown
								label={ t("views.settings.general.default_language") }
								name="settings.default_language"
							/>
							<CurrenciesDropdown
								label={ t("views.settings.general.default_currency") }
								name="settings.default_currency"
							/>
							<TimezonesDropdown
								label={ t("views.settings.general.default_timezone") }
								name="settings.default_timezone"
							/>
						</Stack>
					</FormBand>

					<FormBand
						title={ t("views.settings.general.brand_band_title") }
						description={ t("views.settings.general.brand_band_description") }
					>
						<BrandColorInput
							label={ t("views.settings.general.primary_color") }
							name="settings.primary_color"
							initialValue={ settings.primary_color || DEFAULT_BRAND_COLOR }
						/>
					</FormBand>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(GeneralSettings, "settings")
