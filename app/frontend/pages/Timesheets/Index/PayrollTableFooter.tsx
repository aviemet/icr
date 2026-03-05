import { useTranslation } from "react-i18next"

import { Button, Group, Text } from "@/components"
import { useTableContext } from "@/components/Table/TableContext"

interface PayrollTableFooterProps {
	employeeCount: number
}

export default function PayrollTableFooter({ employeeCount }: PayrollTableFooterProps) {
	const { t } = useTranslation()
	const { tableState: { selected } } = useTableContext()
	const selectedCount = selected.size

	if(employeeCount === 0 && selectedCount === 0) return null

	return (
		<Group justify="space-between" wrap="wrap" gap="md">
			<Group gap="md">
				{ selectedCount > 0 && (
					<Text size="sm" c="dimmed">
						{ t("views.timesheets.index.footer_selected", { count: selectedCount }) }
					</Text>
				) }
				<Text size="sm" c="dimmed">
					{ t("views.timesheets.index.footer_total_hours", { count: 0 }) }
				</Text>
				<Text size="sm" c="dimmed">
					{ t("views.timesheets.index.footer_ot_hours", { count: 0 }) }
				</Text>
			</Group>
			<Group>
				<Button variant="filled" disabled={ selectedCount === 0 }>
					{ t("views.timesheets.index.approve_selected") }
				</Button>
				<Button variant="default">
					{ t("views.timesheets.index.approve_all_clean") }
				</Button>
			</Group>
		</Group>
	)
}
