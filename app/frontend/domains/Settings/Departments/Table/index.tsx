import { Group, Link, Paper, Table, Text, type TableColumn } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { Routes } from "@/lib"

import * as classes from "./DepartmentsTable.css"

interface DepartmentTableProps {
	records: Schema.EmployeeDepartmentsIndex[]
}

export function DepartmentTable({ records }: DepartmentTableProps) {
	const columns: TableColumn<Schema.EmployeeDepartmentsIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			render: (department) => {
				const slug = String(department.slug ?? "")
				const name = String(department.name ?? "")
				return (
					<Link href={ Routes.settingsDepartment(slug) }>
						<Text fw={ 500 } span>{ name }</Text>
					</Link>
				)
			},
		},
		{
			accessor: "description",
			title: "Description",
			render: (department) => {
				const description = String(department.description ?? "")
				return (
					<Text size="sm" c={ description ? undefined : "dimmed" } lineClamp={ 2 }>
						{ description || "—" }
					</Text>
				)
			},
		},
		{
			accessor: "actions",
			title: "Actions",
			textAlign: "right",
			width: 96,
			render: (department) => {
				const slug = String(department.slug ?? "")
				const name = String(department.name ?? "")
				return (
					<Group gap="xs" justify="flex-end" wrap="nowrap">
						<EditButton
							href={ Routes.editSettingsDepartment(slug) }
							label={ name }
						/>
						<DeleteButton
							href={ Routes.settingsDepartment(slug) }
							label={ name }
						/>
					</Group>
				)
			},
		},
	]

	return (
		<Paper
			withBorder
			radius="md"
			shadow="xs"
			style={ { overflow: "hidden" } }
		>
			<Table.Provider>
				<Table.DataTable
					classNames={ { table: classes.table } }
					columns={ columns }
					records={ records }
					selectable={ false }
					height="auto"
					emptyState={ (
						<Text size="sm" c="dimmed">
							No departments yet. Create one to get started.
						</Text>
					) }
				/>
			</Table.Provider>
		</Paper>
	)
}
