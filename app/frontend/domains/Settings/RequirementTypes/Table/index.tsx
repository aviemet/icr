import { useTranslation } from "react-i18next"

import {Group, Link, DataTable, type TableColumn} from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface RequirementTypeTableProps {
	records: Schema.RequirementTypesIndex[]
	model: string
}

export function RequirementTypeTable({ records, model }: RequirementTypeTableProps) {
	const { t } = useTranslation()

	const columns: TableColumn<Schema.RequirementTypesIndex>[] = [
		{
			accessor: "name",
			title: t("views.requirement_types.index.columns.name"),
			sortable: true,
			render: (requirementType) => (
				<Link href={ Routes.settingsRequirementType(String(requirementType.id)) }>
					{ String(requirementType.name ?? "") }
				</Link>
			),
		},
		{
			accessor: "description",
			title: t("views.requirement_types.index.columns.description"),
			sortable: true,
			render: (requirementType) => String(requirementType.description ?? "-"),
		},
		{
			accessor: "actions",
			title: t("views.requirement_types.index.columns.actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (requirementType) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editSettingsRequirementType(String(requirementType.id)) } />
				</Group>
			),
		},
	]

	return (
		<DataTable
			columns={ columns }
			records={ records }
			model={ model }
			selectable
		/>
	)
}
