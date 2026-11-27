import { useTranslation } from "react-i18next"

import { CalendarIcon } from "@/components/Icons"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
} from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

import { ShiftList } from "./ShiftList"

interface StaffingPanelProps {
	dashboard: Schema.DashboardStats
}

export function StaffingPanel({ dashboard }: StaffingPanelProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()

	if(!dashboard.staffing_visible) return null

	const canViewCaseloads = can("clients_managers", "index")
	const staffingTone = dashboard.open_shift_count > 0 ? "alert" : "default"
	const firstOpenShiftClientSlug = dashboard.open_shifts.find((shift) => shift.client_slug)?.client_slug
	const openShiftHref = firstOpenShiftClientSlug
		? Routes.scheduleClient(firstOpenShiftClientSlug)
		: undefined

	return (
		<MetricTile
			title={ t("views.dashboard.staffing.title") }
			tone={ staffingTone }
			icon={ <CalendarIcon size={ 16 } /> }
		>
			<MetricLine
				label={ t("views.dashboard.staffing.open_shifts") }
				value={ (
					<CountChip
						value={ dashboard.open_shift_count }
						alert={ dashboard.open_shift_count > 0 }
					/>
				) }
				href={ openShiftHref }
			/>
			<ShiftList
				shifts={ dashboard.open_shifts }
				emptyLabel={ t("views.dashboard.staffing.empty") }
			/>
			<BoardActionGrid>
				{ canViewCaseloads && (
					<BoardActionTile
						href={ Routes.caseloads() }
						title={ t("views.dashboard.staffing.view_caseloads") }
						hint="Open caseloads"
					/>
				) }
				{ openShiftHref && (
					<BoardActionTile
						href={ openShiftHref }
						title={ t("views.dashboard.staffing.open_shifts") }
						hint="Open schedule"
					/>
				) }
			</BoardActionGrid>
		</MetricTile>
	)
}
