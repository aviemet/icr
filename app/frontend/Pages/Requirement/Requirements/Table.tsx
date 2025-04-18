import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type TableProps } from "@/Components/Table/Table"

const RequirementRequirementTable = (props: TableProps) => {
	return (
		<Table { ...props}>
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
				<Table.RowIterator render={ (requirement_requirement: Schema.RequirementRequirementsIndex) => (
					<Table.Row key={ requirement_requirement.id }>
						<Table.Cell>
							<Link href={ Routes.requirementRequirement(requirement_requirement.id) }>{ requirement_requirement.name }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.requirementRequirement(requirement_requirement.id) }>{ requirement_requirement.description }</Link>
						</Table.Cell>
						
						<Table.Cell>
							<Link href={ Routes.requirementRequirement(requirement_requirement.id) }>{ requirement_requirement.scope_type }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.requirementRequirement(requirement_requirement.id) }>{ requirement_requirement.scope_id }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editRequirementRequirement(requirement_requirement.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default RequirementRequirementTable
