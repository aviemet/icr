import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
	Badge,
	Box,
	Group,
	Link,
	Section,
	Title,
} from "@/components"
import { ClientIcon, ClockIcon, CoinsIcon, PreviousIcon } from "@/components/Icons"
import { CountChip, MetricLine, MetricTile, MetricValue } from "@/features"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"
import {
	countClientsWithPending,
	countFullyReviewedClients,
	sumAuthorizedHours,
	sumRecordValues,
} from "./clientBoardMetrics"
import { ClientsTable } from "./ClientsTable"

export interface ClientsBoardProps {
	payPeriodSlug: string
	periodDates: [string, string]
	finalized: boolean
	canViewEmployees: boolean
	facilitatorPendingShiftCount: number
	periodClients: Schema.ClientsPersisted[]
	pendingShiftCountByClient: Record<string, number>
	reviewedShiftCountByClient: Record<string, number>
	totalShiftCountByClient: Record<string, number>
	ihssHoursByClient?: Record<string, number>
}

export function ClientsBoard({
	payPeriodSlug,
	periodDates,
	finalized,
	canViewEmployees,
	facilitatorPendingShiftCount,
	periodClients,
	pendingShiftCountByClient,
	reviewedShiftCountByClient,
	totalShiftCountByClient,
	ihssHoursByClient = {},
}: ClientsBoardProps) {
	const { t } = useTranslation()
	const [periodStart, periodEnd] = periodDates
	const periodRange = periodStart && periodEnd ? formatter.datetime.range(periodStart, periodEnd) : ""
	const pendingTone = facilitatorPendingShiftCount > 0 ? "alert" : "default"
	const clientCount = periodClients.length

	const metrics = useMemo(() => {
		const reviewedShifts = sumRecordValues(reviewedShiftCountByClient)
		const totalShifts = sumRecordValues(totalShiftCountByClient)
		const ihssUsed = sumRecordValues(ihssHoursByClient)
		const authorizedHours = sumAuthorizedHours(periodClients)
		const remainingHours = Math.max(authorizedHours - ihssUsed, 0)

		return {
			clientsNeedingReview: countClientsWithPending(periodClients, pendingShiftCountByClient),
			fullyReviewedClients: countFullyReviewedClients(
				periodClients,
				pendingShiftCountByClient,
				totalShiftCountByClient,
			),
			reviewedShifts,
			totalShifts,
			ihssUsed,
			authorizedHours,
			remainingHours,
		}
	}, [
		ihssHoursByClient,
		pendingShiftCountByClient,
		periodClients,
		reviewedShiftCountByClient,
		totalShiftCountByClient,
	])

	return (
		<Box className={ classes.viewport }>
			<Box className={ classes.board }>
				<Section variant="panel" className={ classes.chrome }>
					<Box className={ classes.identity }>
						<Group gap="sm" wrap="wrap" align="center">
							<Title order={ 2 }>{ t("views.pay_periods.clients.title") }</Title>
							<Badge variant="light" color={ finalized ? "gray" : "blue" }>
								{ finalized
									? t("views.pay_periods.index.workflow.closed")
									: t("views.pay_periods.index.workflow.pending") }
							</Badge>
						</Group>
						{ periodRange && (
							<span className={ classes.subtitle }>{ periodRange }</span>
						) }
						<span className={ classes.subtitle }>
							{ t("views.pay_periods.clients.help") }
						</span>
					</Box>
				</Section>

				<Box className={ classes.tileRow }>
					<MetricTile
						title={ t("views.pay_periods.clients.tiles.needs_review") }
						tone={ pendingTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue label={ t("views.pay_periods.clients.tiles.pending_shifts") }>
							{ facilitatorPendingShiftCount }
						</MetricValue>
						<MetricLine
							label={ t("views.pay_periods.clients.tiles.clients_needing_review") }
							value={ (
								<CountChip
									value={ metrics.clientsNeedingReview }
									alert={ metrics.clientsNeedingReview > 0 }
								/>
							) }
						/>
						<MetricLine
							label={ t("views.pay_periods.clients.tiles.reviewed_shifts") }
							value={ <CountChip value={ metrics.reviewedShifts } /> }
						/>
						<MetricLine
							label={ t("views.pay_periods.clients.tiles.total_shifts") }
							value={ <CountChip value={ metrics.totalShifts } /> }
						/>
					</MetricTile>

					<MetricTile
						title={ t("views.pay_periods.clients.tiles.clients") }
						icon={ <ClientIcon size={ 16 } /> }
					>
						<MetricValue label={ t("views.pay_periods.clients.tiles.in_caseload") }>
							{ clientCount }
						</MetricValue>
						<MetricLine
							label={ t("views.pay_periods.clients.tiles.fully_reviewed") }
							value={ <CountChip value={ metrics.fullyReviewedClients } /> }
						/>
						<MetricLine
							label={ t("views.pay_periods.clients.tiles.still_pending") }
							value={ (
								<CountChip
									value={ metrics.clientsNeedingReview }
									alert={ metrics.clientsNeedingReview > 0 }
								/>
							) }
						/>
					</MetricTile>

					<MetricTile
						title={ t("views.pay_periods.clients.tiles.totals") }
						icon={ <CoinsIcon size={ 16 } /> }
					>
						<MetricValue label={ t("views.pay_periods.clients.columns.ihss_used") }>
							{ formatter.number.decimal(metrics.ihssUsed, 2) }
						</MetricValue>
						<MetricLine
							label={ t("views.pay_periods.clients.columns.authorized") }
							value={ formatter.number.decimal(metrics.authorizedHours, 2) }
						/>
						<MetricLine
							label={ t("views.pay_periods.clients.tiles.ihss_remaining") }
							value={ formatter.number.decimal(metrics.remainingHours, 2) }
						/>
					</MetricTile>
				</Box>

				<Section variant="panel" className={ classes.panel }>
					<ClientsTable
						payPeriodSlug={ payPeriodSlug }
						clients={ periodClients }
						pendingShiftCountByClient={ pendingShiftCountByClient }
						reviewedShiftCountByClient={ reviewedShiftCountByClient }
						totalShiftCountByClient={ totalShiftCountByClient }
						ihssHoursByClient={ ihssHoursByClient }
					/>
				</Section>

				<Group>
					{ canViewEmployees && (
						<Link
							as="button"
							href={ Routes.period(payPeriodSlug) }
							variant="default"
						>
							{ t("views.pay_periods.clients.view_employees") }
						</Link>
					) }
					<Link
						as="button"
						href={ Routes.payrollPeriods() }
						variant="default"
						leftSection={ <PreviousIcon size={ 16 } /> }
					>
						{ t("views.pay_periods.show.back_to_payroll") }
					</Link>
				</Group>
			</Box>
		</Box>
	)
}
