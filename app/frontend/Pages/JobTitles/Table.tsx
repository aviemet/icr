import { Routes } from "@/lib"
import { Table, Link } from "@/Components"
import { EditButton } from "@/Components/Button"
import { type ITableProps } from "@/Components/Table/Table"

const JobTitleTable = (props: ITableProps) => {
	return (
		<Table>
			<Table.Head>
				<Table.Row>
					<Table.Cell sort="title">Title</Table.Cell>
					<Table.Cell sort="description">Description</Table.Cell>
					<Table.Cell className="actions">Actions</Table.Cell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (job_title: Schema.JobTitlesIndex) => (
					<Table.Row key={ job_title.id }>
						<Table.Cell>
							<Link href={ Routes.jobTitle(job_title.id) }>{ job_title.title }</Link>
						</Table.Cell>
						<Table.Cell>
							<Link href={ Routes.jobTitle(job_title.id) }>{ job_title.description }</Link>
						</Table.Cell>
						<Table.Cell>
							<EditButton href={ Routes.editJobTitle(job_title.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default JobTitleTable
