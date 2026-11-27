import { useTranslation } from "react-i18next"

import { Box, Text } from "@/components"
import { PeopleIcon } from "@/components/Icons"
import { MetricTile } from "@/features"
import { usePermissions } from "@/lib/hooks"

import * as classes from "./Board.css"

interface ActivityPanelProps {
	dashboard: Schema.DashboardStats
}

export function ActivityPanel({ dashboard }: ActivityPanelProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const showActivity = can("clients", "index") || can("employees", "index")

	if(!showActivity) return null

	return (
		<MetricTile
			title={ t("views.dashboard.activity.title") }
			icon={ <PeopleIcon size={ 16 } /> }
		>
			<Box className={ classes.list }>
				{ dashboard.activity_items.length === 0
					? (
						<Text size="sm" c="dimmed">{ t("views.dashboard.activity.empty") }</Text>
					)
					: (
						dashboard.activity_items.map((item) => {
							const label = item.name || t("views.dashboard.activity.unnamed")
							const text = item.kind === "client"
								? t("views.dashboard.activity.item_client", { name: label })
								: t("views.dashboard.activity.item_employee", { name: label })
							return (
								<Box key={ `${item.kind}-${item.id}` } className={ classes.listItem }>
									<span>{ text }</span>
								</Box>
							)
						})
					) }
			</Box>
		</MetricTile>
	)
}
