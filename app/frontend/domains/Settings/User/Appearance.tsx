import { useTranslation } from "react-i18next"

import { Group, Stack, Text } from "@/components"
import { ToggleColorSchemeButton } from "@/components/Button"

export function AppearanceSettings() {
	const { t } = useTranslation()

	return (
		<Group justify="space-between" align="flex-start" wrap="nowrap">
			<Stack gap="xxs">
				<Text size="sm" fw={ 500 }>
					{ t("views.settings.user.color_scheme.label") }
				</Text>
				<Text size="sm" c="dimmed">
					{ t("views.settings.user.color_scheme.description") }
				</Text>
			</Stack>
			<ToggleColorSchemeButton />
		</Group>
	)
}
