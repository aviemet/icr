import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Box,
	Group,
	Link,
	Presence,
	Section,
	Title,
} from "@/components"
import { PreviousIcon } from "@/components/Icons"
import { Select } from "@/components/Inputs"
import {
	applyIhssToggleToShifts,
	type IhssToggleDelta,
	mergeShiftOtHours,
} from "@/domains/TimeSheets/ihssToggle"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"
import { clientHasIhss } from "./clientHasIhss"
import {
	type ClientPeriodEmployee,
	defaultEmployeeId,
	employeeOptionsFromEmployees,
	resolveSelectedEmployeeId,
} from "./clientShiftEmployees"
import { ClientShiftsTable } from "./ClientShiftsTable"

export interface ClientReviewBoardProps {
	payPeriodId: string
	payPeriodSlug: string
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
	payPeriodSlug,
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
	const clientName = periodClient.full_name ?? periodClient.name
	const showIhss = clientHasIhss(periodClient)
	const employeeOptions = useMemo(
		() => employeeOptionsFromEmployees(periodEmployees),
		[periodEmployees],
	)
	const [reviewShifts, setReviewShifts] = useState(shifts)
	const [reviewShiftOtHours, setReviewShiftOtHours] = useState(shiftOtHours)
	const [reviewIhssHoursUsed, setReviewIhssHoursUsed] = useState(ihssHoursUsed)
	const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
		() => defaultEmployeeId(shifts, employeeOptionsFromEmployees(periodEmployees)),
	)
	const [prevShifts, setPrevShifts] = useState(shifts)
	const [prevShiftOtHours, setPrevShiftOtHours] = useState(shiftOtHours)
	const [prevIhssHoursUsed, setPrevIhssHoursUsed] = useState(ihssHoursUsed)
	const [prevEmployeeOptions, setPrevEmployeeOptions] = useState(employeeOptions)

	if(
		shifts !== prevShifts ||
		shiftOtHours !== prevShiftOtHours ||
		ihssHoursUsed !== prevIhssHoursUsed
	) {
		setPrevShifts(shifts)
		setPrevShiftOtHours(shiftOtHours)
		setPrevIhssHoursUsed(ihssHoursUsed)
		setReviewShifts(shifts)
		setReviewShiftOtHours(shiftOtHours)
		setReviewIhssHoursUsed(ihssHoursUsed)
	}

	const nextSelectedEmployeeId = resolveSelectedEmployeeId(
		selectedEmployeeId,
		reviewShifts,
		employeeOptions,
	)
	if(
		employeeOptions !== prevEmployeeOptions ||
		nextSelectedEmployeeId !== selectedEmployeeId
	) {
		setPrevEmployeeOptions(employeeOptions)
		if(nextSelectedEmployeeId !== selectedEmployeeId) {
			setSelectedEmployeeId(nextSelectedEmployeeId)
		}
	}

	const handleIhssToggle = (delta: IhssToggleDelta) => {
		setReviewShifts(current => applyIhssToggleToShifts(current, delta))
		setReviewShiftOtHours(current => mergeShiftOtHours(current, delta.shift_ot_hours))
		if(typeof delta.ihss_hours_used === "number") {
			setReviewIhssHoursUsed(delta.ihss_hours_used)
		}
	}

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Title order={ 2 }>
							<Presence>{ `${t("views.clients.show.title")}: ${clientName}` }</Presence>
						</Title>
						{ periodRange && (
							<span className={ classes.subtitle }>{ periodRange }</span>
						) }
						{ finalized && (
							<span className={ classes.subtitle }>
								{ t("views.pay_periods.client_show.finalized_locked") }
							</span>
						) }
						{ showIhss && (
							<span className={ classes.subtitle }>
								{ t("views.pay_periods.clients.columns.ihss_used") }: { reviewIhssHoursUsed }
								{ " / " }
								<Presence>{ periodClient.ihss_authorized_hours }</Presence>
							</span>
						) }
						{ employeeOptions.length > 0
							? (
								<Select
									name="employee_id"
									label={ t("views.pay_periods.client_show.help") }
									placeholder={ t("views.pay_periods.client_show.employee_placeholder") }
									options={ employeeOptions }
									value={ selectedEmployeeId }
									onChange={ setSelectedEmployeeId }
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
						payPeriodSlug={ payPeriodSlug }
						clientId={ periodClient.id }
						clientSlug={ periodClient.slug }
						employees={ periodEmployees }
						selectedEmployeeId={ selectedEmployeeId }
						shifts={ reviewShifts }
						shiftExceptionReasons={ shiftExceptionReasons }
						shiftOtHours={ reviewShiftOtHours }
						canFacilitatorApprove={ canFacilitatorApprove }
						canEditTimes={ !finalized }
						showIhss={ showIhss }
						canEditIhss={ showIhss && canEditIhss && ihssAssignmentMode === "shift" }
						onIhssToggle={ handleIhssToggle }
					/>
				</Section>

				<Group>
					<Link
						as="button"
						href={ Routes.clientsPeriod(payPeriodSlug) }
						variant="default"
						leftSection={ <PreviousIcon size={ 16 } /> }
					>
						{ t("views.pay_periods.client_show.back_to_clients") }
					</Link>
					{ canViewEmployees && (
						<Link
							as="button"
							href={ Routes.period(payPeriodSlug) }
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
