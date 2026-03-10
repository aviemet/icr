import { Table, Link } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

export function RequirementRequirementTable(props: TableProps) {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="name">Name</Table.HeadCell>
					<Table.HeadCell sort="description">Description</Table.HeadCell>

					<Table.HeadCell sort="scope_type">Scope_type</Table.HeadCell>
					<Table.HeadCell sort="scope_id">Scope_id</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (requirement_requirement: Schema.RequirementRequirementsIndex) => {
					const id = requirement_requirement.id as string
					const name = String(requirement_requirement.name as string | number)
					const description = String(requirement_requirement.description as string | number)
					const scopeType = String(requirement_requirement.scope_type as string | number)
					const scopeId = String(requirement_requirement.scope_id as string | number)

					return (
						<Table.Row key={ id }>
							<Table.Cell>
								<Link href={ Routes.requirement(id) }>{ name }</Link>
							</Table.Cell>
							<Table.Cell>
								<Link href={ Routes.requirement(id) }>{ description }</Link>
							</Table.Cell>

							<Table.Cell>
								<Link href={ Routes.requirement(id) }>{ scopeType }</Link>
							</Table.Cell>
							<Table.Cell>
								<Link href={ Routes.requirement(id) }>{ scopeId }</Link>
							</Table.Cell>
							<Table.Cell>
								<EditButton href={ Routes.editRequirement(id) } />
							</Table.Cell>
						</Table.Row>
					)
				} }
				/>
			</Table.Body>
		</Table>
	)
}
