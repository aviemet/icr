import { useTranslation } from "react-i18next"

import { PeopleIcon } from "@/components/Icons"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
	MetricValue,
} from "@/features"
import { Routes } from "@/lib"
import { usePageProps, usePermissions } from "@/lib/hooks"

interface TeamPanelProps {
	dashboard: Schema.DashboardStats
}

export function TeamPanel({ dashboard }: TeamPanelProps) {
	const { t } = useTranslation()
	const { auth } = usePageProps()
	const { can } = usePermissions()
	const canViewEmployees = can("employees", "index")
	const canCreateEmployees = can("employees", "create")

	if(!(canViewEmployees || canCreateEmployees)) return null

	const employeesHref = canViewEmployees ? Routes.employees() : undefined
	const applicantsHref = canViewEmployees ? Routes.applicants() : undefined
	const ownEmployeeHref = auth.own_employee_slug
		? Routes.employee(auth.own_employee_slug)
		: null

	return (
		<MetricTile
			title={ t("views.dashboard.team.title") }
			icon={ <PeopleIcon size={ 16 } /> }
		>
			<MetricValue
				label={ t("views.dashboard.team.member_count") }
				href={ employeesHref }
			>
				{ dashboard.active_team_count }
			</MetricValue>
			{ canViewEmployees && (
				<MetricLine
					label={ t("views.dashboard.team.hiring_pipeline") }
					value={ (
						<CountChip
							value={ dashboard.hiring_pipeline_count }
							alert={ dashboard.hiring_pipeline_count > 0 }
						/>
					) }
					href={ applicantsHref }
				/>
			) }
			<BoardActionGrid>
				{ canViewEmployees && (
					<BoardActionTile
						href={ Routes.employees() }
						title={ t("views.dashboard.team.view_all") }
						hint="Open employee list"
					/>
				) }
				{ canCreateEmployees && (
					<BoardActionTile
						href={ Routes.newEmployee() }
						title={ t("views.dashboard.team.add_new") }
						hint="Start onboarding"
					/>
				) }
				{ ownEmployeeHref && (
					<BoardActionTile
						href={ ownEmployeeHref }
						title="My profile"
						hint="Open your employee record"
					/>
				) }
			</BoardActionGrid>
		</MetricTile>
	)
}
