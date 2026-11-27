import { useTranslation } from "react-i18next"

import { Badge, Group, Link, Table, DataTable, type TableColumn } from "@/components"
import { formatter, Routes } from "@/lib"

import { periodWorkflowLabel } from "./workflow"

export interface PayPeriodRow {
	id: string
	slug: string
	starts_at: string
	ends_at: string
	finalized_at?: string
	workflow_status: string
	approved_count: number
	pending_count: number
	flagged_count: number
	overtime_hours: number
	payroll_due_date: string
}

interface PayPeriodsTableProps {
	periods: PayPeriodRow[]
	currentPeriodId?: string
}

export function PayPeriodsTable({ periods, currentPeriodId }: PayPeriodsTableProps) {
	const { t } = useTranslation()

	const columns: TableColumn<PayPeriodRow>[] = [
		{
			accessor: "range",
			title: t("views.pay_periods.index.columns.range"),
			sortable: false,
			render: (period) => (
				<Group gap="sm" wrap="nowrap">
					<Link href={ Routes.period(period.slug) }>
						{ formatter.datetime.range(period.starts_at, period.ends_at) }
					</Link>
					{ period.id === currentPeriodId && (
						<Badge variant="light" color="gray" size="sm">
							{ t("views.pay_periods.index.current_badge") }
						</Badge>
					) }
				</Group>
			),
		},
		{
			accessor: "status",
			title: t("views.pay_periods.index.columns.status"),
			sortable: false,
			render: (period) => periodWorkflowLabel(period.workflow_status, t),
		},
		{
			accessor: "approved",
			title: t("views.pay_periods.index.columns.approved"),
			sortable: false,
			render: (period) => t("views.pay_periods.index.summary.approved", {
				approved: period.approved_count,
				total: period.approved_count + period.pending_count,
			}),
		},
		{
			accessor: "flagged",
			title: t("views.pay_periods.index.columns.flagged"),
			sortable: false,
			render: (period) => String(period.flagged_count),
		},
		{
			accessor: "overtime",
			title: t("views.pay_periods.index.columns.overtime"),
			sortable: false,
			render: (period) => t("views.timesheets.index.summary_hours", { count: period.overtime_hours }),
		},
		{
			accessor: "due",
			title: t("views.pay_periods.index.columns.due"),
			sortable: false,
			render: (period) => {
				if(period.finalized_at) {
					return t("views.pay_periods.index.summary.finalized_on", {
						date: formatter.datetime.dateShort(period.finalized_at),
					})
				}

				return formatter.datetime.dateShort(period.payroll_due_date)
			},
		},
	]

	return (
		<Table.Provider>
			<DataTable
				columns={ columns }
				records={ periods }
				selectable={ false }
				rowBackgroundColor={ (period) => (
					period.id === currentPeriodId
						? "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))"
						: undefined
				) }
			/>
		</Table.Provider>
	)
}
