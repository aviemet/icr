import { router } from "@inertiajs/react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Badge, Button, Group, Stack, Text } from "@/components"
import { type IhssToggleDelta } from "@/domains/TimeSheets/ihssToggle"
import { ReviewTable } from "@/domains/TimeSheets/ReviewTable"
import { Routes } from "@/lib"

import {
	type ClientPeriodEmployee,
	hoursForShifts,
	shiftsForEmployee,
} from "./clientShiftEmployees"

interface ClientShiftsTableProps {
	payPeriodId: string
	payPeriodSlug: string
	clientId: string
	clientSlug: string
	employees: ClientPeriodEmployee[]
	selectedEmployeeId: string | null
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons: Record<string, string[]>
	shiftOtHours: Record<string, number>
	canFacilitatorApprove: boolean
	canEditTimes: boolean
	showIhss?: boolean
	canEditIhss?: boolean
	onIhssToggle?: (delta: IhssToggleDelta) => void
}

export function ClientShiftsTable({
	payPeriodId,
	payPeriodSlug,
	clientId,
	clientSlug,
	employees,
	selectedEmployeeId,
	shifts,
	shiftExceptionReasons,
	shiftOtHours,
	canFacilitatorApprove,
	canEditTimes,
	showIhss = false,
	canEditIhss = false,
	onIhssToggle,
}: ClientShiftsTableProps) {
	const { t } = useTranslation()
	const selectedEmployee = employees.find(employee => employee.id === selectedEmployeeId) ?? null
	const selectedShifts = useMemo(
		() => shiftsForEmployee(shifts, selectedEmployeeId),
		[shifts, selectedEmployeeId],
	)
	const pendingApprovals = selectedShifts
		.filter(shift => !shift.facilitator_approved_at)
		.map(shift => ({
			shift_id: shift.shift_id,
			occurrence_starts_at: shift.occurrence_starts_at
				? new Date(String(shift.occurrence_starts_at)).toISOString()
				: new Date(String(shift.starts_at)).toISOString(),
		}))
	const pendingCount = pendingApprovals.length
	const { regularHours, otHours, ihssHours } = useMemo(
		() => hoursForShifts(selectedShifts, shiftOtHours),
		[selectedShifts, shiftOtHours],
	)
	const reloadHref = Routes.clientPeriod(payPeriodSlug, clientSlug)

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
							approvals: pendingApprovals,
							pay_period_id: payPeriodId,
							client_id: clientId,
						}, {
							preserveState: true,
							preserveScroll: true,
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
				ihssHours={ ihssHours }
				canEditTimes={ canEditTimes }
				employeeId={ selectedEmployee.id }
				employeeSlug={ selectedEmployee.slug }
				payPeriodId={ payPeriodId }
				payPeriodSlug={ payPeriodSlug }
				clientId={ clientId }
				reloadHref={ reloadHref }
				showClientColumn={ false }
				canFacilitatorApprove={ canFacilitatorApprove }
				showIhss={ showIhss }
				canEditIhss={ canEditIhss }
				onIhssToggle={ onIhssToggle }
			/>
		</Stack>
	)
}
