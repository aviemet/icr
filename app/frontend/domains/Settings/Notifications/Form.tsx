import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { Switch } from "@/components/Inputs"

export function NotificationsForm() {
	const { t } = useTranslation()

	return (
		<Stack gap="sm">
			<Switch
				name="settings.notifications_payroll_approval_reminders"
				label={ t("views.settings.notifications.payroll_approval_reminders.label") }
				description={ t("views.settings.notifications.payroll_approval_reminders.description") }
			/>
		</Stack>
	)
}
