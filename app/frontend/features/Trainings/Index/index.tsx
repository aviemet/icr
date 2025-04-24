import { Table, Link, type TableProps } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

const TrainingTable = (props: TableProps) => {
	return (
		<Table { ...props }>
			<Table.Head>
				<Table.Row>
					<Table.HeadCell sort="name">Name</Table.HeadCell>
					<Table.HeadCell sort="estimated_minutes">Duration</Table.HeadCell>
					<Table.HeadCell sort="description">Description</Table.HeadCell>
					<Table.HeadCell className="actions">Actions</Table.HeadCell>
				</Table.Row>
			</Table.Head>
			<Table.Body>
				<Table.RowIterator render={ (training: Schema.TrainingsIndex) => (
					<Table.Row key={ training.id }>

						<Table.Cell>
							<Link href={ Routes.training(training.id) }>{ training.name }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.training(training.id) }>{ training.estimated_minutes }</Link>
						</Table.Cell>

						<Table.Cell>
							<Link href={ Routes.training(training.id) }>{ training.description }</Link>
						</Table.Cell>

						<Table.Cell>
							<EditButton href={ Routes.editTraining(training.id) } />
						</Table.Cell>
					</Table.Row>
				) } />
			</Table.Body>
		</Table>
	)
}

export default TrainingTable
