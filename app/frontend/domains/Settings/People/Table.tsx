import { Table, Link, type TableColumn } from "@/components"
import { EditButton } from "@/components/Button"
import { CheckIcon } from "@/components/Icons"
import { Routes } from "@/lib"

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
}

export function PersonTable({ records, model }: PersonTableProps) {
	const columns: TableColumn<Schema.PeopleIndex>[] = [
		{
			accessor: "first_name",
			title: "FirstName",
			sortable: true,
			render: (person) => (
				<Link href={ personLink(person) }>
					{ person.first_name }
				</Link>
			),
		},
		{
			accessor: "last_name",
			title: "LastName",
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
			title: "Roll",
			sortable: true,
			render: (person) => person.agency_role,
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			sortable: false,
			render: (person) => <EditButton href={ Routes.editSettingsPerson(person.slug) } />,
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
