import { router } from "@inertiajs/react"
import { LoadingOverlay } from "@mantine/core"
import { useModals } from "@mantine/modals"
import axios from "axios"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Box, Group, Table, type TableProps, Text } from "@/components"
import { type IhssToggleDelta } from "@/domains/TimeSheets/ihssToggle"
import { confirmBusyAction } from "@/features"
import { formatter, Routes, assertStatus, HTTP_STATUS } from "@/lib"

import { ReviewRow } from "./ReviewRow"

interface ReviewTableProps extends TableProps {
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons?: Record<string, string[]>
	shiftOtHours?: Record<string, number>
	regularHours: number
	otHours: number
	ptoHours?: number
	sickHours?: number
	holidayHours?: number
	canEditTimes: boolean
	employeeId: string
	employeeSlug: string
	payPeriodId: string
	clientId?: string
	reloadHref?: string
	showClientColumn?: boolean
	canFacilitatorApprove?: boolean
	canEditIhss?: boolean
	onIhssToggle?: (delta: IhssToggleDelta) => void
}

export function ReviewTable({
	shifts,
	shiftExceptionReasons = {},
	shiftOtHours = {},
	regularHours,
	otHours,
	ptoHours = 0,
	sickHours = 0,
	holidayHours = 0,
	canEditTimes,
	employeeId,
	employeeSlug,
	payPeriodId,
	clientId,
	reloadHref,
	showClientColumn = true,
	canFacilitatorApprove = false,
	canEditIhss = false,
	onIhssToggle,
	...props
}: ReviewTableProps) {
	const { t } = useTranslation()
	const modals = useModals()
	const [busy, setBusy] = useState(false)
	const resolvedReloadHref = reloadHref ?? Routes.periodEmployeeReview(payPeriodId, employeeId)

	const leadingColumnCount =
		1 +
		(showClientColumn ? 1 : 0) +
		1 +
		1 +
		1 +
		(canEditIhss ? 1 : 0)
	const trailingColumnCount =
		1 +
		1 +
		(canFacilitatorApprove ? 1 : 0) +
		1
	const columnCount = leadingColumnCount + trailingColumnCount

	const reloadReview = () => {
		router.get(resolvedReloadHref)
	}

	const deleteShift = async (shift: Schema.ShiftsReview) => {
		setBusy(true)
		try {
			const response = await axios.delete(Routes.apiCalendarEvent(shift.calendar_event_id), {
				params: shift.is_recurring && shift.occurrence_starts_at
					? {
						edit_scope: "one",
						occurrence_starts_at: new Date(String(shift.occurrence_starts_at)).toISOString(),
					}
					: undefined,
			})
			assertStatus(response, HTTP_STATUS.NO_CONTENT)
			reloadReview()
		} catch (error) {
			setBusy(false)
			throw error
		}
	}

	const handleDeleteShift = (shift: Schema.ShiftsReview) => {
		confirmBusyAction({
			modals,
			title: t("views.timesheets.employee_review.delete_shift"),
			children: (
				<Text size="sm">
					{ t("views.timesheets.employee_review.delete_shift_confirm") }
				</Text>
			),
			confirmLabel: t("views.timesheets.employee_review.delete_shift_confirm_button"),
			cancelLabel: t("views.timesheets.employee_review.delete_shift_cancel"),
			run: () => deleteShift(shift),
		})
	}

	return (
		<Box style={ { position: "relative" } }>
			<LoadingOverlay visible={ busy } overlayProps={ { blur: 1 } } />

			<Table.Provider>
				<Table { ...props }>
					<Table.Head>
						<Table.Row>
							<Table.HeadCell>{ t("views.timesheets.employee_review.date") }</Table.HeadCell>
							{ showClientColumn && (
								<Table.HeadCell>{ t("views.timesheets.employee_review.client") }</Table.HeadCell>
							) }
							<Table.HeadCell>{ t("views.timesheets.employee_review.in_out_times") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.hours") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.shift_type") }</Table.HeadCell>
							{ canEditIhss && (
								<Table.HeadCell>{ t("views.timesheets.employee_review.ihss") }</Table.HeadCell>
							) }
							<Table.HeadCell>{ t("views.timesheets.employee_review.ot") }</Table.HeadCell>
							<Table.HeadCell>{ t("views.timesheets.employee_review.exception") }</Table.HeadCell>
							{ canFacilitatorApprove && (
								<Table.HeadCell>{ t("views.pay_periods.client_show.columns.status") }</Table.HeadCell>
							) }
							<Table.HeadCell>{ t("views.timesheets.employee_review.actions") }</Table.HeadCell>
						</Table.Row>
					</Table.Head>

					<Table.Body>
						{ shifts.length === 0
							? (
								<Table.Row>
									<Table.Cell colSpan={ columnCount }>
										<Text size="sm" c="dimmed">{ t("views.timesheets.employee_review.no_shifts") }</Text>
									</Table.Cell>
								</Table.Row>
							)
							: (
								shifts.map(shift => (
									<ReviewRow
										key={ shift.id }
										shift={ shift }
										shiftExceptionReasons={ shiftExceptionReasons }
										shiftOtHours={ shiftOtHours }
										canEditTimes={ canEditTimes }
										onDelete={ () => handleDeleteShift(shift) }
										deleting={ busy }
										employeeSlug={ employeeSlug }
										payPeriodId={ payPeriodId }
										clientId={ clientId }
										reloadHref={ resolvedReloadHref }
										showClientColumn={ showClientColumn }
										canFacilitatorApprove={ canFacilitatorApprove }
										canEditIhss={ canEditIhss }
										canEditShiftType={ canEditTimes }
										onIhssToggle={ onIhssToggle }
									/>
								))
							) }
					</Table.Body>

					{ shifts.length > 0 && (
						<Table.Footer>
							<Table.Row>
								<Table.Cell colSpan={ leadingColumnCount }>
									<Text fw={ 500 }>{ t("views.timesheets.employee_review.total") }</Text>
								</Table.Cell>
								<Table.Cell colSpan={ trailingColumnCount }>
									<Group gap="md">
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.footer_regular") }: { formatter.number.decimal(regularHours, 2) } hrs
										</Text>
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.footer_overtime") }: { formatter.number.decimal(otHours, 2) } hrs
										</Text>
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.pto_hours") }: { formatter.number.decimal(ptoHours, 2) } hrs
										</Text>
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.sick_hours") }: { formatter.number.decimal(sickHours, 2) } hrs
										</Text>
										<Text size="sm" fw={ 500 }>
											{ t("views.timesheets.employee_review.holiday_hours") }: { formatter.number.decimal(holidayHours, 2) } hrs
										</Text>
									</Group>
								</Table.Cell>
							</Table.Row>
						</Table.Footer>
					) }
				</Table>
			</Table.Provider>
		</Box>
	)
}
