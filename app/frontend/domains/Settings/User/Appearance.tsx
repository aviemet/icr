import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Group, Stack, Text } from "@/components"
import { ToggleColorSchemeButton } from "@/components/Button"
import { Switch } from "@/components/Inputs"
import { usePageProps } from "@/lib/hooks"
import { useUpdateUserPreferences } from "@/queries"

export function AppearanceSettings() {
	const { t } = useTranslation()
	const { auth: { user } } = usePageProps()
	const mutate = useUpdateUserPreferences({ params: { userId: String(user.slug) } })
	const dyslexiaFont = user.user_preferences?.dyslexia_font === true

	const handleDyslexiaFontChange = (checked: boolean) => {
		mutate.mutate({ dyslexia_font: checked }, {
			onSuccess: () => {
				router.reload({ only: ["auth"] })
			},
		})
	}

	return (
		<Stack gap="lg">
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
			<Group justify="space-between" align="flex-start" wrap="nowrap">
				<Stack gap="xxs">
					<Text size="sm" fw={ 500 }>
						{ t("views.settings.user.dyslexia_font.label") }
					</Text>
					<Text size="sm" c="dimmed">
						{ t("views.settings.user.dyslexia_font.description") }
					</Text>
				</Stack>
				<Switch
					checked={ dyslexiaFont }
					onChange={ (event) => handleDyslexiaFontChange(event.currentTarget.checked) }
					aria-label={ t("views.settings.user.dyslexia_font.label") }
				/>
			</Group>
		</Stack>
	)
}
