import { Button, Grid, Table, Title } from "@/components"
import { Form, TextInput } from "@/components/Form"
import { Routes } from "@/lib"

interface ShiftTypesProps {
	shift_types: Schema.Category[]
}

const ShiftTypes = ({ shift_types }: ShiftTypesProps) => {
	return (
		<Form
			to={ Routes.apiCategories() }
			async
			model="category"
			method="patch"
			data={ { shift_types } }
		>
			<Grid>

				<Grid.Col>
					<Title order={ 3 }>Shift Types</Title>
				</Grid.Col>

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
										<Button
										// onClick={ () => deleteShiftType.mutate({ id: shift_type.id }) }
										// loading={ deleteShiftType.isPending }
											color="red"
										>
											Delete
										</Button>
									</Table.Cell>
								</Table.Row>
							)) }
							<Table.Row>
								<Table.Cell>
									<TextInput
										name="shift_type.name"
										placeholder="New Shift Type"
									/>
								</Table.Cell>

								<Table.Cell>
									{ /* <Button
								onClick={ () => {
									if(getData("setting.shift_type.name").trim()) {
										console.log("CLICK")
										createShiftType.mutate({ name: newShiftType })
									}
								} }
								loading={ createShiftType.isPending }
							>
								Add Shift Type
							</Button> */ }
								</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table>
				</Grid.Col>

			</Grid>
		</Form>
	)
}

export default ShiftTypes
