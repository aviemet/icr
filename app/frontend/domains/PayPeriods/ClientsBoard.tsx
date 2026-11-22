import { useTranslation } from "react-i18next"

import {
	Badge,
	Box,
	Group,
	Link,
	Section,
	Title,
} from "@/components"
import { ClientIcon, ClockIcon, PreviousIcon } from "@/components/Icons"
import { MetricTile, MetricValue } from "@/features"
import { formatter, Routes } from "@/lib"

import * as classes from "./Board.css"
import { ClientsTable } from "./ClientsTable"

export interface ClientsBoardProps {
	payPeriodId: string
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
	payPeriodId,
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
						title={ t("views.pay_periods.clients.status_pending") }
						tone={ pendingTone }
						icon={ <ClockIcon size={ 16 } /> }
					>
						<MetricValue>{ facilitatorPendingShiftCount }</MetricValue>
					</MetricTile>
					<MetricTile
						title={ t("views.pay_periods.clients.columns.client") }
						icon={ <ClientIcon size={ 16 } /> }
					>
						<MetricValue>{ clientCount }</MetricValue>
					</MetricTile>
				</Box>

				<Section variant="panel" className={ classes.panel }>
					<ClientsTable
						payPeriodId={ payPeriodId }
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
							href={ Routes.period(payPeriodId) }
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
