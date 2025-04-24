import { Link, Table } from "@/components"
import { EditButton } from "@/components/Button"
import { type TableProps } from "@/components/Table/Table"
import { Routes } from "@/lib"

const JobTitleTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.Cell sort="title">Title</Table.Cell>
					<Table.Cell sort="description">Description</Table.Cell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (job_title: Schema.JobTitlesIndex) => (
					<Table.Row key={ job_title.id }>

						<Table.Cell>
							<Link href={ Routes.settingsJobTitle(job_title.slug) }>{ job_title.name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.settingsJobTitle(job_title.slug) }>{ job_title.description }</Link>
						</Table.Cell>

						<Table.Cell>
							<EditButton href={ Routes.editSettingsJobTitle(job_title.slug) } />
						</Table.Cell>

					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default JobTitleTable
