import { useTranslation } from "react-i18next"

import { HomeIcon } from "@/components/Icons"
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

interface ClientsPanelProps {
	dashboard: Schema.DashboardStats
}

export function ClientsPanel({ dashboard }: ClientsPanelProps) {
	const { t } = useTranslation()
	const { auth } = usePageProps()
	const { can } = usePermissions()
	const canViewClients = can("clients", "index")
	const canCreateClients = can("clients", "create")

	if(!(canViewClients || canCreateClients)) return null

	const clientsHref = canViewClients ? Routes.clients() : undefined
	const ownClientHref = auth.own_client_slug
		? Routes.client(auth.own_client_slug)
		: null

	return (
		<MetricTile
			title={ t("views.dashboard.clients.title") }
			icon={ <HomeIcon size={ 16 } /> }
		>
			<MetricValue
				label={ t("views.dashboard.clients.active_count") }
				href={ clientsHref }
			>
				{ dashboard.active_client_count }
			</MetricValue>
			<MetricLine
				label={ t("views.dashboard.clients.inactive_count") }
				value={ <CountChip value={ dashboard.inactive_client_count } /> }
				href={ clientsHref }
			/>
			<BoardActionGrid>
				{ canViewClients && (
					<BoardActionTile
						href={ Routes.clients() }
						title={ t("views.dashboard.clients.view_all") }
						hint="Open client list"
					/>
				) }
				{ canCreateClients && (
					<BoardActionTile
						href={ Routes.newClient() }
						title={ t("views.dashboard.clients.add_new") }
						hint="Create a client"
					/>
				) }
				{ ownClientHref && (
					<BoardActionTile
						href={ ownClientHref }
						title="My profile"
						hint="Open your client record"
					/>
				) }
			</BoardActionGrid>
		</MetricTile>
	)
}
