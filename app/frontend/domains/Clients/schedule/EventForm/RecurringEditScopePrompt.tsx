import { Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Button, Group, Stack } from "@/components"
import { type CalendarEventEditScope } from "@/queries/calendarEvents"

type RecurringEditScopePromptProps = {
	onChoose: (scope: CalendarEventEditScope) => void
	onCancel: () => void
}

export function RecurringEditScopePrompt({
	onChoose,
	onCancel,
}: RecurringEditScopePromptProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="sm">
			<Text size="sm">
				{ t("views.clients.schedule.event_form.edit_recurring_body") }
			</Text>
			<Stack gap="xs">
				<Button onClick={ () => onChoose("all") }>
					{ t("views.clients.schedule.event_form.edit_all_events") }
				</Button>
				<Button variant="default" onClick={ () => onChoose("future") }>
					{ t("views.clients.schedule.event_form.edit_this_and_future") }
				</Button>
				<Button variant="default" onClick={ () => onChoose("one") }>
					{ t("views.clients.schedule.event_form.edit_this_occurrence") }
				</Button>
			</Stack>
			<Group justify="flex-end">
				<Button variant="subtle" onClick={ onCancel } type="button">
					{ t("views.clients.schedule.event_form.edit_scope_cancel") }
				</Button>
			</Group>
		</Stack>
	)
}
