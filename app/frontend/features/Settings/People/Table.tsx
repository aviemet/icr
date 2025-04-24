import { Table, Link, type TableProps } from "@/components"
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

const PersonTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="first_name">FirstName</Table.HeadCell>
					<Table.HeadCell sort="last_name">LastName</Table.HeadCell>
					<Table.HeadCell sort="user.email">Email</Table.HeadCell>
					<Table.HeadCell sort="login_enabled">Login Enabled</Table.HeadCell>
					<Table.HeadCell sort="role">Roll</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (person: Schema.PeopleIndex) => (
					<Table.Row key={ person.id }>

						<Table.Cell>
							<Link href={ personLink(person) }>
								{ person.first_name }
							</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ personLink(person) }>
								{ person.last_name }
							</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ personLink(person) }>
								{ person?.user?.email || "" }
							</Link>
						</Table.Cell>

						<Table.Cell>
							{ person.login_enabled ? <CheckIcon color="green" /> : <></> }
						</Table.Cell>

						<Table.Cell>
							{ person.agency_role }
						</Table.Cell>

						<Table.Cell>
							<EditButton href={ Routes.settingsPerson(person.slug) } />
						</Table.Cell>

					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default PersonTable
