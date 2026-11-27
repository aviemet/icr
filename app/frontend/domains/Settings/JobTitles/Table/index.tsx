import { Group, Link, Paper, Presence, Table, DataTable, Text, type TableColumn } from "@/components"
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
			render: (jobTitle) => (
				<Presence>{ jobTitle.department?.name }</Presence>
			),
		},
		{
			accessor: "description",
			title: "Description",
			render: (jobTitle) => (
				<Presence>
					{ jobTitle.description
						? <Text size="sm" lineClamp={ 2 }>{ String(jobTitle.description) }</Text>
						: null }
				</Presence>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			render: (jobTitle) => {
				const slug = String(jobTitle.slug ?? "")
				const name = String(jobTitle.name ?? "")
				return (
					<Group gap="xs" wrap="nowrap">
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
			style={ { overflow: "hidden" } }
		>
			<Table.Provider>
				<DataTable
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
