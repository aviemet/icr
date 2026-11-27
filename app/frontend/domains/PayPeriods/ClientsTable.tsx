import { useTranslation } from "react-i18next"

import { Badge, Group, Link, Presence, Table, type TableColumn, Text } from "@/components"
import { Routes } from "@/lib"

interface ClientsTableProps {
	payPeriodSlug: string
	clients: Schema.ClientsPersisted[]
	pendingShiftCountByClient: Record<string, number>
	reviewedShiftCountByClient: Record<string, number>
	totalShiftCountByClient: Record<string, number>
	ihssHoursByClient?: Record<string, number>
}

export function ClientsTable({
	payPeriodSlug,
	clients,
	pendingShiftCountByClient,
	reviewedShiftCountByClient,
	totalShiftCountByClient,
	ihssHoursByClient = {},
}: ClientsTableProps) {
	const { t } = useTranslation()

	const columns: TableColumn<Schema.ClientsPersisted>[] = [
		{
			accessor: "client",
			title: t("views.pay_periods.clients.columns.client"),
			sortable: false,
			render: (client) => (
				<Link href={ Routes.clientPeriod(payPeriodSlug, client.slug) }>
					<Presence>{ client.full_name ?? client.name }</Presence>
				</Link>
			),
		},
		{
			accessor: "pending",
			title: t("views.pay_periods.clients.columns.pending"),
			sortable: false,
			render: (client) => (
				<Text size="sm">{ pendingShiftCountByClient[client.id] ?? 0 }</Text>
			),
		},
		{
			accessor: "reviewed",
			title: t("views.pay_periods.clients.columns.reviewed"),
			sortable: false,
			render: (client) => {
				const reviewed = reviewedShiftCountByClient[client.id] ?? 0
				const total = totalShiftCountByClient[client.id] ?? 0

				return (
					<Text size="sm">{ t("views.pay_periods.clients.reviewed_of_total", { reviewed, total }) }</Text>
				)
			},
		},
		{
			accessor: "ihss_used",
			title: t("views.pay_periods.clients.columns.ihss_used"),
			sortable: false,
			render: (client) => (
				<Text size="sm">{ ihssHoursByClient[client.id] ?? 0 }</Text>
			),
		},
		{
			accessor: "authorized",
			title: t("views.pay_periods.clients.columns.authorized"),
			sortable: false,
			render: (client) => (
				<Text size="sm"><Presence>{ client.ihss_authorized_hours }</Presence></Text>
			),
		},
		{
			accessor: "status",
			title: t("views.pay_periods.clients.columns.status"),
			sortable: false,
			render: (client) => {
				const pending = pendingShiftCountByClient[client.id] ?? 0
				const complete = pending === 0 && (totalShiftCountByClient[client.id] ?? 0) > 0

				return (
					<Badge variant="light" color={ complete ? "green" : "yellow" } size="sm">
						{ complete
							? t("views.pay_periods.clients.status_reviewed")
							: t("views.pay_periods.clients.status_pending") }
					</Badge>
				)
			},
		},
		{
			accessor: "actions",
			title: t("views.pay_periods.clients.columns.actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (client) => (
				<Group gap="xs" wrap="nowrap">
					<Link
						as="button"
						href={ Routes.clientPeriod(payPeriodSlug, client.slug) }
						buttonProps={ { variant: "light", size: "xs" } }
					>
						{ t("views.pay_periods.clients.review") }
					</Link>
				</Group>
			),
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ clients }
			model="clients"
			selectable={ false }
		/>
	)
}
