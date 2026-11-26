import { useTranslation } from "react-i18next"

import { Box } from "@/components"
import { PeopleIcon, ClientIcon, WarningTriangleIcon } from "@/components/Icons"
import { CountChip, MetricLine, MetricTile, MetricValue } from "@/features"

import * as classes from "./Board.css"

interface CaseloadMetricsProps {
	facilitatorCount: number
	clientsOnCaseloadCount: number
	unassignedCount: number
}

export function CaseloadMetrics({
	facilitatorCount,
	clientsOnCaseloadCount,
	unassignedCount,
}: CaseloadMetricsProps) {
	const { t } = useTranslation()
	const hasUnassigned = unassignedCount > 0
	const unassignedTone = hasUnassigned ? "alert" : "default"

	return (
		<Box className={ classes.tileRow }>
			<MetricTile
				title={ t("views.caseloads.metrics.facilitators") }
				icon={ <PeopleIcon size={ 16 } /> }
			>
				<MetricValue>{ facilitatorCount }</MetricValue>
			</MetricTile>

			<MetricTile
				title={ t("views.caseloads.metrics.on_caseload") }
				icon={ <ClientIcon size={ 16 } /> }
			>
				<MetricValue>{ clientsOnCaseloadCount }</MetricValue>
			</MetricTile>

			<MetricTile
				title={ t("views.caseloads.metrics.unassigned") }
				tone={ unassignedTone }
				icon={ hasUnassigned ? <WarningTriangleIcon size={ 16 } /> : <ClientIcon size={ 16 } /> }
			>
				<MetricLine
					label={ t("views.caseloads.metrics.unassigned") }
					value={ <CountChip value={ unassignedCount } alert={ hasUnassigned } /> }
				/>
			</MetricTile>
		</Box>
	)
}
