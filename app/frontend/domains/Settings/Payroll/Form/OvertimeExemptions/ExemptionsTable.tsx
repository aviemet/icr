import { useTranslation } from "react-i18next"

import {
	Badge,
	Button,
	Modal,
	Text,
	Table, DataTable,
	type TableColumn,
} from "@/components"

import { type CategoryOption } from "./criterionUtils"
import { ExemptionFormModalBody } from "./ExemptionFormModalBody"

interface ExemptionsTableProps {
	exemptions: Schema.OvertimeExemption[]
	categoryOptions: CategoryOption[]
}

function criteriaGroupCount(exemption: Schema.OvertimeExemption): number {
	return exemption.criteria.filter(group => Object.keys(group).length > 0).length
}

export function ExemptionsTable({ exemptions, categoryOptions }: ExemptionsTableProps) {
	const { t } = useTranslation()

	const columns: TableColumn<Schema.OvertimeExemption>[] = [
		{
			accessor: "name",
			title: t("views.settings.payroll.overtime_exemptions.columns.name"),
			render: exemption => (
				<Text fw={ 500 }>{ exemption.name }</Text>
			),
		},
		{
			accessor: "active",
			title: t("views.settings.payroll.overtime_exemptions.columns.status"),
			render: exemption => (
				<Badge
					variant="light"
					color={ exemption.active ? "green" : "gray" }
					size="sm"
				>
					{ exemption.active
						? t("views.settings.payroll.overtime_exemptions.active")
						: t("views.settings.payroll.overtime_exemptions.inactive") }
				</Badge>
			),
		},
		{
			accessor: "criteria",
			title: t("views.settings.payroll.overtime_exemptions.columns.criteria"),
			render: exemption => (
				<Text size="sm" c="dimmed">
					{ t("views.settings.payroll.overtime_exemptions.criteria_count", {
						count: criteriaGroupCount(exemption),
					}) }
				</Text>
			),
		},
		{
			accessor: "actions",
			title: t("views.settings.payroll.overtime_exemptions.columns.actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			render: exemption => (
				<Modal
					title={ t("views.settings.payroll.overtime_exemptions.form_title_edit") }
					size="xl"
					trigger={ (
						<Button variant="subtle" size="compact-sm">
							{ t("views.settings.payroll.overtime_exemptions.edit") }
						</Button>
					) }
				>
					<ExemptionFormModalBody
						exemption={ exemption }
						categoryOptions={ categoryOptions }
					/>
				</Modal>
			),
		},
	]

	return (
		<Table.Provider>
			<DataTable
				columns={ columns }
				records={ exemptions }
				selectable={ false }
				height="auto"
				emptyState={ (
					<Text size="sm" c="dimmed">
						{ t("views.settings.payroll.overtime_exemptions.empty") }
					</Text>
				) }
			/>
		</Table.Provider>
	)
}
