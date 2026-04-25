import { Table, Link, Group } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableColumn } from "@/components/Table"
import { Routes } from "@/lib"

interface RequirementRequirementTableProps {
	records: Schema.RequirementRequirementsIndex[]
	pagination: Schema.Pagination
	model: string
}

export function RequirementRequirementTable({ records, pagination, model }: RequirementRequirementTableProps) {
	const columns: TableColumn<Schema.RequirementRequirementsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			sortable: true,
			render: (requirement) => <Link href={ Routes.requirement(String(requirement.id)) }>{ String(requirement.name ?? "") }</Link>,
		},
		{
			accessor: "description",
			title: "Description",
			sortable: true,
			render: (requirement) => <Link href={ Routes.requirement(String(requirement.id)) }>{ String(requirement.description ?? "") }</Link>,
		},
		{
			accessor: "scope_type",
			title: "Scope_type",
			sortable: true,
			render: (requirement) => <Link href={ Routes.requirement(String(requirement.id)) }>{ String(requirement.scope_type ?? "") }</Link>,
		},
		{
			accessor: "scope_id",
			title: "Scope_id",
			sortable: true,
			render: (requirement) => <Link href={ Routes.requirement(String(requirement.id)) }>{ String(requirement.scope_id ?? "") }</Link>,
		},
		{
			accessor: "actions",
			title: "Actions",
			sortable: false,
			render: (requirement) => (
				<Group wrap="nowrap" gap="xs">
					<EditButton href={ Routes.editRequirement(String(requirement.id)) } />
				</Group>
			),
		},
	]

	return (
		<Table.DataTable
			columns={ columns }
			records={ records }
			pagination={ pagination }
			model={ model }
			selectable
		/>
	)
}
