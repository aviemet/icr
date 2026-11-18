import { Group, Link, Paper, Table, Text, type TableColumn } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { Routes } from "@/lib"

import * as classes from "./JobTitlesTable.css"

interface JobTitleTableProps {
	records: Schema.EmployeeJobTitlesIndex[]
}

export function JobTitleTable({ records }: JobTitleTableProps) {
	const columns: TableColumn<Schema.EmployeeJobTitlesIndex>[] = [
		{
			accessor: "name",
			title: "Title",
			render: (jobTitle) => {
				const slug = String(jobTitle.slug ?? "")
				const name = String(jobTitle.name ?? "")
				return (
					<Link href={ Routes.settingsJobTitle(slug) }>
						<Text fw={ 500 } span>{ name }</Text>
					</Link>
				)
			},
		},
		{
			accessor: "department.name",
			title: "Department",
			render: (jobTitle) => {
				const departmentName = String(jobTitle.department?.name ?? "")
				return (
					<Text size="sm" c={ departmentName ? undefined : "dimmed" }>
						{ departmentName || "—" }
					</Text>
				)
			},
		},
		{
			accessor: "description",
			title: "Description",
			render: (jobTitle) => {
				const description = String(jobTitle.description ?? "")
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
			render: (jobTitle) => {
				const slug = String(jobTitle.slug ?? "")
				const name = String(jobTitle.name ?? "")
				return (
					<Group gap="xs" justify="flex-end" wrap="nowrap">
						<EditButton
							href={ Routes.editSettingsJobTitle(slug) }
							label={ name }
						/>
						<DeleteButton
							href={ Routes.settingsJobTitle(slug) }
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
			className={ classes.panel }
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
							No job titles yet. Create one to get started.
						</Text>
					) }
				/>
			</Table.Provider>
		</Paper>
	)
}
