import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Button, Group, Text } from "@/components"
import { useTableContext } from "@/components/Table/Provider"
import { Routes } from "@/lib"

interface PayrollTableFooterProps {
	employeeCount: number
	totalRegularHours?: number
	totalOtHours?: number
	approvalWindowOpen: boolean
	timesheetIdsByEmployee: Record<string, string>
}

export default function PayrollTableFooter({
	employeeCount,
	totalRegularHours = 0,
	totalOtHours = 0,
	approvalWindowOpen,
	timesheetIdsByEmployee,
}: PayrollTableFooterProps) {
	const { t } = useTranslation()

	const { selectedRecordIds } = useTableContext()
	const selectedCount = selectedRecordIds.length
	const selectedTimesheetIds = selectedRecordIds
		.map(employeeId => timesheetIdsByEmployee[employeeId])
		.filter((timesheetId): timesheetId is string => Boolean(timesheetId))
	const canApproveSelected = selectedCount > 0 && selectedTimesheetIds.length > 0

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
					{ t("views.timesheets.index.footer_total_hours", { count: totalRegularHours }) }
				</Text>
				<Text size="sm" c="dimmed">
					{ t("views.timesheets.index.footer_ot_hours", { count: totalOtHours }) }
				</Text>
			</Group>
			{ approvalWindowOpen && (
				<Group>
					<Button
						variant="filled"
						disabled={ !canApproveSelected }
						onClick={ () => router.post(Routes.bulkApproveTimesheets(), { timesheet_ids: selectedTimesheetIds }) }
					>
						{ t("views.timesheets.index.approve_selected") }
					</Button>
					<Button
						variant="default"
						onClick={ () => router.post(Routes.bulkApproveTimesheets(), { approve_all: true }) }
					>
						{ t("views.timesheets.index.approve_all_clean") }
					</Button>
				</Group>
			) }
		</Group>
	)
}
