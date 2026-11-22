import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Box,
	Group,
	Link,
	Section,
	Title,
} from "@/components"
import { PreviousIcon } from "@/components/Icons"
import { Select } from "@/components/Inputs"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"
import {
	type ClientPeriodEmployee,
	defaultEmployeeId,
	employeeOptionsFromEmployees,
} from "./clientShiftEmployees"
import { ClientShiftsTable } from "./ClientShiftsTable"

export interface ClientReviewBoardProps {
	payPeriodId: string
	periodDates: [string, string]
	finalized: boolean
	canFacilitatorApprove: boolean
	canViewEmployees: boolean
	periodClient: Schema.ClientsPersisted
	periodEmployees: ClientPeriodEmployee[]
	shifts: Schema.ShiftsReview[]
	shiftExceptionReasons: Record<string, string[]>
	shiftOtHours: Record<string, number>
	ihssHoursUsed?: number
	ihssAssignmentMode?: string
	canEditIhss?: boolean
}

export function ClientReviewBoard({
	payPeriodId,
	periodDates,
	finalized,
	canFacilitatorApprove,
	canViewEmployees,
	periodClient,
	periodEmployees,
	shifts,
	shiftExceptionReasons,
	shiftOtHours,
	ihssHoursUsed = 0,
	ihssAssignmentMode = "shift",
	canEditIhss = false,
}: ClientReviewBoardProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = periodDates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const clientName = periodClient.full_name ?? periodClient.name ?? "-"
	const employeeOptions = useMemo(
		() => employeeOptionsFromEmployees(periodEmployees),
		[periodEmployees],
	)
	const [userSelectedEmployeeId, setUserSelectedEmployeeId] = useState<string | null>(null)
	const selectedEmployeeId = useMemo(() => {
		if(
			userSelectedEmployeeId !== null
			&& employeeOptions.some(option => option.value === userSelectedEmployeeId)
		) {
			return userSelectedEmployeeId
		}

		return defaultEmployeeId(shifts, employeeOptions)
	}, [userSelectedEmployeeId, employeeOptions, shifts])

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Title order={ 2 }>{ clientName }</Title>
						{ periodRange && (
							<span className={ classes.subtitle }>{ periodRange }</span>
						) }
						{ finalized && (
							<span className={ classes.subtitle }>
								{ t("views.pay_periods.client_show.finalized_locked") }
							</span>
						) }
						<span className={ classes.subtitle }>
							{ t("views.pay_periods.clients.columns.ihss_used") }: { ihssHoursUsed }
							{ " / " }
							{ periodClient.ihss_authorized_hours ?? "-" }
						</span>
						{ employeeOptions.length > 0
							? (
								<Select
									name="employee_id"
									label={ t("views.pay_periods.client_show.help") }
									placeholder={ t("views.pay_periods.client_show.employee_placeholder") }
									options={ employeeOptions }
									value={ selectedEmployeeId }
									onChange={ setUserSelectedEmployeeId }
									searchable
									clearable={ false }
								/>
							)
							: (
								<span className={ classes.subtitle }>
									{ t("views.pay_periods.client_show.no_employees") }
								</span>
							) }
					</Box>
				</Section>

				<Section variant="panel" className={ classes.panel }>
					<ClientShiftsTable
						payPeriodId={ payPeriodId }
						clientId={ periodClient.id }
						employees={ periodEmployees }
						selectedEmployeeId={ selectedEmployeeId }
						shifts={ shifts }
						shiftExceptionReasons={ shiftExceptionReasons }
						shiftOtHours={ shiftOtHours }
						canFacilitatorApprove={ canFacilitatorApprove }
						canEditTimes={ !finalized }
						canEditIhss={ canEditIhss && ihssAssignmentMode === "shift" }
					/>
				</Section>

				<Group>
					<Link
						as="button"
						href={ Routes.clientsPeriod(payPeriodId) }
						variant="default"
						leftSection={ <PreviousIcon size={ 16 } /> }
					>
						{ t("views.pay_periods.client_show.back_to_clients") }
					</Link>
					{ canViewEmployees && (
						<Link
							as="button"
							href={ Routes.period(payPeriodId) }
							variant="default"
						>
							{ t("views.pay_periods.clients.view_employees") }
						</Link>
					) }
				</Group>
			</Box>
		</Box>
	)
}
