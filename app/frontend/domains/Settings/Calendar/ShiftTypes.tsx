import { router } from "@inertiajs/react"
import { useState } from "react"

import { Button, Group, Stack, Table, Text } from "@/components"
import { TextInput } from "@/components/Inputs"
import { useCreateCategory, useDeleteCategory } from "@/queries"

interface ShiftTypesProps {
	shift_types: Schema.Category[]
}

export function ShiftTypes({ shift_types }: ShiftTypesProps) {
	const [newName, setNewName] = useState("")
	const createCategory = useCreateCategory({
		onSuccess: () => {
			setNewName("")
			router.reload({ only: ["shift_types"] })
		},
	})
	const deleteCategory = useDeleteCategory({
		onSuccess: () => {
			router.reload({ only: ["shift_types"] })
		},
	})

	const handleCreate = () => {
		const name = newName.trim()
		if(!name || createCategory.isPending) return
		createCategory.mutate({ name })
	}

	return (
		<Stack gap="md">
			<Table>
				<Table.Head>
					<Table.Row>
						<Table.Cell>Shift Type</Table.Cell>
						<Table.Cell>Actions</Table.Cell>
					</Table.Row>
				</Table.Head>
				<Table.Body>
					{ shift_types.map(shiftType => {
						const slug = shiftType.slug || shiftType.id
						const isSystem = Boolean(shiftType.system)

						return (
							<Table.Row key={ slug || shiftType.name }>
								<Table.Cell>
									<Group gap="xs">
										<Text>{ shiftType.name }</Text>
										{ isSystem && (
											<Text size="xs" c="dimmed">System</Text>
										) }
									</Group>
								</Table.Cell>
								<Table.Cell>
									{ !isSystem && slug && (
										<Button
											color="red"
											variant="subtle"
											size="compact-sm"
											loading={ deleteCategory.isPending }
											onClick={ () => deleteCategory.mutate({ slug }) }
										>
											Delete
										</Button>
									) }
								</Table.Cell>
							</Table.Row>
						)
					}) }
					<Table.Row>
						<Table.Cell>
							<TextInput
								value={ newName }
								onChange={ event => setNewName(event.currentTarget.value) }
								placeholder="New Shift Type"
								onKeyDown={ event => {
									if(event.key === "Enter") {
										event.preventDefault()
										handleCreate()
									}
								} }
							/>
						</Table.Cell>
						<Table.Cell>
							<Button
								variant="light"
								size="compact-sm"
								loading={ createCategory.isPending }
								disabled={ newName.trim().length === 0 }
								onClick={ handleCreate }
							>
								Add
							</Button>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table>
		</Stack>
	)
}
