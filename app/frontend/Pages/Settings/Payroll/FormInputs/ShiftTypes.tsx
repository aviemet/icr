import { Button, Grid, Table, Title } from "@/Components"
import { TextInput } from "@/Components/Form"
import { useCreateCategory, useDeleteCategory } from "@/queries/categories"
import { useForm } from "use-inertia-form"
import { type PayrollSettingsFormData } from ".."

interface ShiftTypesProps {
	shift_types: Schema.Category[]
}

const ShiftTypes = ({ shift_types }: ShiftTypesProps) => {
	const { getData } = useForm<PayrollSettingsFormData>()

	const createShiftType = useCreateCategory()

	const deleteShiftType = useDeleteCategory()

	return (
		<>
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
		</>
	)
}

export default ShiftTypes
