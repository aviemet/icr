import { router } from "@inertiajs/react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Badge, Button, Group, Stack, Text } from "@/components"
import { ReviewTable } from "@/domains/TimeSheets/ReviewTable"
import { Routes } from "@/lib"

import {
	type ClientPeriodEmployee,
	hoursForShifts,
	shiftsForEmployee,
} from "./clientShiftEmployees"

interface ClientShiftsTableProps {
	payPeriodId: string
	clientId: string
	employees: ClientPeriodEmployee[]
	selectedEmployeeId: string | null
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons: Record<string, string[]>
	shiftOtHours: Record<string, number>
	canFacilitatorApprove: boolean
	canEditTimes: boolean
}

export function ClientShiftsTable({
	payPeriodId,
	clientId,
	employees,
	selectedEmployeeId,
	shifts,
	shiftExceptionReasons,
	shiftOtHours,
	canFacilitatorApprove,
	canEditTimes,
}: ClientShiftsTableProps) {
	const { t } = useTranslation()
	const selectedEmployee = employees.find(employee => employee.id === selectedEmployeeId) ?? null
	const selectedShifts = useMemo(
		() => shiftsForEmployee(shifts, selectedEmployeeId),
		[shifts, selectedEmployeeId],
	)
	const pendingIds = selectedShifts
		.filter(shift => !shift.facilitator_approved_at)
		.map(shift => shift.id)
	const pendingCount = pendingIds.length
	const { regularHours, otHours } = useMemo(
		() => hoursForShifts(selectedShifts, shiftOtHours),
		[selectedShifts, shiftOtHours],
	)
	const reloadHref = Routes.clientPeriod(payPeriodId, clientId)

	if(employees.length === 0) {
		return (
			<Text size="sm" c="dimmed">
				{ t("views.pay_periods.client_show.no_employees") }
			</Text>
		)
	}

	if(!selectedEmployee) {
		return (
			<Text size="sm" c="dimmed">
				{ t("views.pay_periods.client_show.employee_placeholder") }
			</Text>
		)
	}

	return (
		<Stack gap="md">
			<Group justify="space-between" gap="sm" wrap="wrap" align="center">
				<Group gap="sm" wrap="wrap" align="center">
					<Badge variant="light" color={ pendingCount === 0 ? "green" : "yellow" }>
						{ pendingCount === 0
							? t("views.pay_periods.clients.status_reviewed")
							: t("views.pay_periods.clients.status_pending") }
					</Badge>
					<Text size="sm" c="dimmed">
						{ t("views.pay_periods.client_show.pending_count", { count: pendingCount }) }
					</Text>
				</Group>
				{ canFacilitatorApprove && pendingCount > 0 && (
					<Button
						variant="filled"
						size="sm"
						onClick={ () => router.post(Routes.bulkApproveShifts(), {
							shift_ids: pendingIds,
							pay_period_id: payPeriodId,
							client_id: clientId,
						}) }
					>
						{ t("views.pay_periods.client_show.approve_all_pending") }
					</Button>
				) }
			</Group>

			<ReviewTable
				key={ selectedEmployee.id }
				shifts={ selectedShifts }
				shiftExceptionReasons={ shiftExceptionReasons }
				shiftOtHours={ shiftOtHours }
				regularHours={ regularHours }
				otHours={ otHours }
				canEditTimes={ canEditTimes }
				employeeId={ selectedEmployee.id }
				employeeSlug={ selectedEmployee.slug }
				payPeriodId={ payPeriodId }
				reloadHref={ reloadHref }
				showClientColumn={ false }
				canFacilitatorApprove={ canFacilitatorApprove }
			/>
		</Stack>
	)
}
