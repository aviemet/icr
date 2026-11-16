import { useTranslation } from "react-i18next"

import { Group, Link, Table, type TableColumn } from "@/components"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface PermissionTablePermissionable {
	id: string
	name?: string
	email?: string
}

interface PermissionTableAssignment {
	id: string
	permissionable_type: string
	permissionable: PermissionTablePermissionable
}

export interface PermissionTableRecord {
	id: string
	name: string
	description: string
	precedence: number
	assignments: PermissionTableAssignment[]
}

interface PermissionTableProps {
	records: PermissionTableRecord[]
	pagination?: Schema.Pagination
	model?: string
}

export function PermissionTable({ records, pagination, model }: PermissionTableProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()

	const columns: TableColumn<PermissionTableRecord>[] = [
		{
			accessor: "name",
			title: t("views.permissions.index.table.name"),
		},
		{
			accessor: "description",
			title: t("views.permissions.index.table.description"),
		},
		{
			accessor: "precedence",
			title: t("views.permissions.index.table.precedence"),
		},
		{
			accessor: "assignments",
			title: t("views.permissions.index.table.assignments"),
			render: (group) => (
				<>
					{ group.assignments.map((assignment) => (
						<div key={ assignment.id }>
							{ assignment.permissionable_type === "User"
								? assignment.permissionable.email
								: assignment.permissionable.name }
						</div>
					)) }
				</>
			),
		},
		{
			accessor: "actions",
			title: t("views.permissions.index.table.actions"),
			sortable: false,
			render: (group) => (
				<Group wrap="nowrap" gap="xs">
					{ can("update", "permission_groups") && (
						<Link href={ Routes.editPermission(group.id) } as="button" buttonProps={ { variant: "secondary" } }>
							Edit
						</Link>
					) }
					{ can("destroy", "permission_groups") && (
						<Link
							href={ Routes.permission(group.id) }
							method="delete"
							as="button"
							buttonProps={ { variant: "danger" } }
						>
							Delete
						</Link>
					) }
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
		/>
	)
}
