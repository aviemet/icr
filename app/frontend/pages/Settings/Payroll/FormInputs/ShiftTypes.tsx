import { Button, Grid, Table } from "@/components"
import { Form } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { Routes } from "@/lib"

interface ShiftTypesProps {
	shift_types: Schema.Category[]
}

const ShiftTypes = ({ shift_types }: ShiftTypesProps) => {
	return (
		<Form
			action={ Routes.apiCategories() }
			method="patch"
			initialData={ { shift_types } }
		>
			<Grid>
				<Grid.Col>
					<Table>
						<Table.Head>
							<Table.Row>
								<Table.Cell>Shift Type</Table.Cell>
								<Table.Cell>Actions</Table.Cell>
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{ shift_types.map(shift_type => (
								<Table.Row key={ shift_type.id }>
									<Table.Cell>{ shift_type.name }</Table.Cell>
									<Table.Cell>
										<Button color="red">
											Delete
										</Button>
									</Table.Cell>
								</Table.Row>
							)) }
							<Table.Row>
								<Table.Cell>
									<TextInput
										name="category.name"
										placeholder="New Shift Type"
									/>
								</Table.Cell>
								<Table.Cell />
							</Table.Row>
						</Table.Body>
					</Table>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default ShiftTypes
