import { Group, Link, Paper, Table, Text, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { CheckIcon } from "@/components/Icons"
import { Routes } from "@/lib"

import * as classes from "./PeopleTable.css"

const personLink = (person: Schema.PeopleIndex) => {
	if(person.agency_role === "Client") {
		return Routes.client(person?.client?.slug)
	}

	if(person.agency_role === "Employee") {
		return Routes.employee(person?.employee?.slug)
	}

	return Routes.settingsPerson(person.slug)
}

interface PersonTableProps {
	records: Schema.PeopleIndex[]
	model?: string
	pagination?: Schema.Pagination
}

export function PersonTable({ records, model, pagination }: PersonTableProps) {
	const columns: TableColumn<Schema.PeopleIndex>[] = [
		{
			accessor: "first_name",
			title: "First Name",
			sortable: true,
			render: (person) => (
				<Link href={ personLink(person) }>
					<Text fw={ 500 } span>{ person.first_name }</Text>
				</Link>
			),
		},
		{
			accessor: "last_name",
			title: "Last Name",
			sortable: true,
			render: (person) => (
				<Link href={ personLink(person) }>
					{ person.last_name }
				</Link>
			),
		},
		{
			accessor: "user.email",
			title: "Email",
			sortable: true,
			render: (person) => (
				<Link href={ personLink(person) }>
					{ person.user?.email || "" }
				</Link>
			),
		},
		{
			accessor: "login_enabled",
			title: "Login Enabled",
			sortable: true,
			render: (person) => person.login_enabled ? <CheckIcon color="green" /> : null,
		},
		{
			accessor: "role",
			title: "Role",
			sortable: true,
			render: (person) => person.agency_role,
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (person) => (
				<Group gap="xs" wrap="nowrap">
					<EditButton href={ Routes.editSettingsPerson(person.slug) } />
				</Group>
			),
		},
	]

	return (
		<Paper
			withBorder
			radius="md"
			shadow="xs"
			style={ { overflow: "hidden" } }
		>
			<Table.Provider
				selectable
				model={ model }
				pagination={ pagination }
			>
				<Table.DataTable
					classNames={ { table: classes.table } }
					columns={ columns }
					records={ records }
					model={ model }
					selectable
					height="auto"
					emptyState={ (
						<Text size="sm" c="dimmed">
							No people yet. Create one to get started.
						</Text>
					) }
				/>
				{ pagination && model && (
					<Table.Pagination pagination={ pagination } model={ model } />
				) }
			</Table.Provider>
		</Paper>
	)
}
