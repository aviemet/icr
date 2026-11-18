import { router } from "@inertiajs/react"
import clsx from "clsx"
import { useState } from "react"

import {
	Badge,
	Button,
	Divider,
	Group,
	Paper,
	Stack,
	Table,
	Text,
	Title,
} from "@/components"
import { DeleteButton } from "@/components/Button"
import { PlusIcon } from "@/components/Icons"
import { TextInput } from "@/components/Inputs"
import { useCreateCategory, useDeleteCategory } from "@/queries"

import * as classes from "./ShiftTypes.css"

interface ShiftTypesProps {
	shift_types: Schema.Category[]
}

export function ShiftTypes({ shift_types }: ShiftTypesProps) {
	const [newName, setNewName] = useState("")
	const createCategory = useCreateCategory()
	const deleteCategory = useDeleteCategory()

	const handleCreate = () => {
		const name = newName.trim()
		if(!name || createCategory.isPending) return
		createCategory.mutate({ name }, {
			onSuccess: () => {
				setNewName("")
				router.reload({ only: ["shift_types"] })
			},
		})
	}

	const handleDelete = (slug: string) => {
		if(deleteCategory.isPending) return
		deleteCategory.mutate({ slug }, {
			onSuccess: () => {
				router.reload({ only: ["shift_types"] })
			},
		})
	}

	return (
		<Stack gap="xl">
			<Stack gap="md">
				<Stack gap={ 4 }>
					<Title order={ 4 }>Existing types</Title>
					<Text size="sm" c="dimmed">
						System types ship with the app and stay put. Custom types can be removed.
					</Text>
				</Stack>

				<Paper
					withBorder
					radius="md"
					shadow="xs"
					className={ classes.panel }
					style={ { overflow: "hidden" } }
				>
					<Table
						className={ classes.table }
						horizontalSpacing="md"
						verticalSpacing="sm"
						withRowBorders
					>
						<Table.Head>
							<Table.Row>
								<Table.HeadCell>Shift Type</Table.HeadCell>
								<Table.HeadCell style={ { width: 120, textAlign: "right" } }>
									Actions
								</Table.HeadCell>
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{ shift_types.length === 0 && (
								<Table.Row>
									<Table.Cell colSpan={ 2 }>
										<Text size="sm" c="dimmed">
											No shift types yet. Add one below.
										</Text>
									</Table.Cell>
								</Table.Row>
							) }

							{ shift_types.map(shiftType => {
								const slug = shiftType.slug || shiftType.id
								const isSystem = Boolean(shiftType.system)

								return (
									<Table.Row key={ slug || shiftType.name }>
										<Table.Cell>
											<Group gap="sm">
												<Text fw={ 500 }>{ shiftType.name }</Text>
												{ isSystem && (
													<Badge size="sm" variant="light" color="gray">
														System
													</Badge>
												) }
											</Group>
										</Table.Cell>
										<Table.Cell style={ { textAlign: "right" } }>
											{ isSystem
												? (
													<Text size="sm" c="dimmed">
														Protected
													</Text>
												)
												: (
													<DeleteButton
														label={ shiftType.name }
														disabled={ !slug || deleteCategory.isPending }
														loading={ deleteCategory.isPending }
														onDelete={ () => {
															if(!slug) return
															handleDelete(slug)
														} }
													/>
												) }
										</Table.Cell>
									</Table.Row>
								)
							}) }
						</Table.Body>
					</Table>
				</Paper>
			</Stack>

			<Divider />

			<Stack gap="md">
				<Stack gap={ 4 }>
					<Title order={ 4 }>Add shift type</Title>
					<Text size="sm" c="dimmed">
						Create a custom category for scheduling and overtime rules.
					</Text>
				</Stack>

				<Paper
					withBorder
					radius="md"
					shadow="xs"
					p="md"
					className={ clsx(classes.panel, classes.addForm) }
				>
					<Group align="flex-end" gap="sm" wrap="nowrap">
						<TextInput
							id="new-shift-type-name"
							label="Name"
							value={ newName }
							onChange={ event => setNewName(event.currentTarget.value) }
							placeholder="e.g. Training"
							style={ { flex: 1 } }
							onKeyDown={ event => {
								if(event.key === "Enter") {
									event.preventDefault()
									handleCreate()
								}
							} }
						/>
						<Button
							leftSection={ <PlusIcon size={ 16 } /> }
							loading={ createCategory.isPending }
							disabled={ newName.trim().length === 0 }
							onClick={ handleCreate }
						>
							Add
						</Button>
					</Group>
				</Paper>
			</Stack>
		</Stack>
	)
}
