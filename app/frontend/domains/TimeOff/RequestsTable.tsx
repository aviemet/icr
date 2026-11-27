import { router } from "@inertiajs/react"
import { useTranslation } from "react-i18next"

import { Button, DataTable, Group, Presence, type TableColumn, Text } from "@/components"
import { formatter, Routes } from "@/lib"

type TimeOffRequestRow = Schema.TimeOffRequestsIndex

export interface RequestsTableProps {
	requests: TimeOffRequestRow[]
	emptyLabel: string
	showEmployee?: boolean
	canApprove?: boolean
	canCancelOwn?: boolean
	currentEmployeeId?: string
}

export function RequestsTable({
	requests,
	emptyLabel,
	showEmployee = false,
	canApprove = false,
	canCancelOwn = false,
	currentEmployeeId,
}: RequestsTableProps) {
	const { t } = useTranslation()

	if(requests.length === 0) {
		return <Text c="dimmed" size="sm">{ emptyLabel }</Text>
	}

	const statusLabel = (status: string) => {
		switch(status) {
			case "pending":
				return t("views.time_off.index.status_pending")
			case "approved":
				return t("views.time_off.index.status_approved")
			case "denied":
				return t("views.time_off.index.status_denied")
			case "canceled":
				return t("views.time_off.index.status_canceled")
			default:
				return status
		}
	}

	const kindLabel = (kind: string) => {
		if(kind === "sick") return t("views.time_off.index.kind_sick")
		return t("views.time_off.index.kind_pto")
	}

	const columns: TableColumn<TimeOffRequestRow>[] = [
		...(showEmployee
			? [{
				accessor: "employee",
				title: t("views.time_off.index.employee"),
				sortable: false as const,
				render: (request: TimeOffRequestRow) => (
					<Text size="sm">{ request.employee?.full_name ?? request.employee?.name ?? "-" }</Text>
				),
			}]
			: []),
		{
			accessor: "kind",
			title: t("views.time_off.index.kind"),
			sortable: false,
			render: (request) => kindLabel(request.kind),
		},
		{
			accessor: "starts_at",
			title: t("views.time_off.index.starts_at"),
			sortable: false,
			render: (request) => (
				<Presence>{ request.starts_at ? formatter.datetime.dateShort(request.starts_at) : null }</Presence>
			),
		},
		{
			accessor: "ends_at",
			title: t("views.time_off.index.ends_at"),
			sortable: false,
			render: (request) => (
				<Presence>{ request.ends_at ? formatter.datetime.dateShort(request.ends_at) : null }</Presence>
			),
		},
		{
			accessor: "hours",
			title: t("views.time_off.index.hours"),
			sortable: false,
			render: (request) => formatter.number.decimal(Number(request.hours), 2),
		},
		{
			accessor: "status",
			title: t("views.time_off.index.status"),
			sortable: false,
			render: (request) => statusLabel(request.status),
		},
		{
			accessor: "actions",
			title: t("views.time_off.index.actions"),
			sortable: false,
			render: (request) => {
				if(request.status !== "pending") return <Presence>{ null }</Presence>

				return (
					<Group gap="xs">
						{ canApprove && (
							<>
								<Button
									size="xs"
									variant="filled"
									onClick={ () => router.post(Routes.approveTimeOffRequest(request.id)) }
								>
									{ t("views.time_off.index.approve") }
								</Button>
								<Button
									size="xs"
									variant="default"
									onClick={ () => router.post(Routes.denyTimeOffRequest(request.id)) }
								>
									{ t("views.time_off.index.deny") }
								</Button>
							</>
						) }
						{ canCancelOwn && currentEmployeeId === request.employee_id && (
							<Button
								size="xs"
								variant="subtle"
								onClick={ () => router.post(Routes.cancelTimeOffRequest(request.id)) }
							>
								{ t("views.time_off.index.cancel") }
							</Button>
						) }
					</Group>
				)
			},
		},
	]

	return (
		<DataTable
			columns={ columns }
			records={ requests }
			model="time_off_requests"
		/>
	)
}
