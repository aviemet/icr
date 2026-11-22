import { useTranslation } from "react-i18next"

import { Group, Link, Table, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface RequirementTableProps {
	records: Schema.RequirementRequirementsIndex[]
	model: string
}

export function RequirementTable({ records, model }: RequirementTableProps) {
	const { t } = useTranslation()

	const columns: TableColumn<Schema.RequirementRequirementsIndex>[] = [
		{
			accessor: "name",
			title: t("views.requirements.index.columns.name"),
			sortable: true,
			render: (requirement) => (
				<Link href={ Routes.settingsRequirement(String(requirement.id)) }>
					{ String(requirement.name ?? "") }
				</Link>
			),
		},
		{
			accessor: "type_name",
			title: t("views.requirements.index.columns.type"),
			sortable: false,
			render: (requirement) => String(requirement.type_name ?? "-"),
		},
		{
			accessor: "scope_label",
			title: t("views.requirements.index.columns.scope"),
			sortable: false,
			render: (requirement) => String(requirement.scope_label ?? "-"),
		},
		{
			accessor: "enforcement",
			title: t("views.requirements.index.columns.enforcement"),
			sortable: false,
			render: (requirement) => t(`views.requirements.form.enforcement_${requirement.enforcement}`, {
				defaultValue: String(requirement.enforcement ?? "-"),
			}),
		},
		{
			accessor: "trainings_count",
			title: t("views.requirements.index.columns.trainings"),
			sortable: false,
			render: (requirement) => String(requirement.trainings_count ?? 0),
		},
		{
			accessor: "credentials_count",
			title: t("views.requirements.index.columns.credentials"),
			sortable: false,
			render: (requirement) => String(requirement.credentials_count ?? 0),
		},
		{
			accessor: "actions",
			title: t("views.requirements.index.columns.actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (requirement) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editSettingsRequirement(String(requirement.id)) } />
				</Group>
			),
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
