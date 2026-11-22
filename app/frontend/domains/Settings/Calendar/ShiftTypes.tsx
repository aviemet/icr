import { router } from "@inertiajs/react"
import { useState } from "react"

import {
	Badge,
	Button,
	Group,
	Text,
	type TableColumn,
	Table,
} from "@/components"
import { DeleteButton } from "@/components/Button"
import { PlusIcon } from "@/components/Icons"
import { TextInput } from "@/components/Inputs"
import { FormBand, FormBandStack } from "@/features"
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

	const columns: TableColumn<Schema.Category>[] = [
		{
			accessor: "name",
			title: "Shift Type",
			render: (shiftType) => (
				<Group gap="sm">
					<Text fw={ 500 }>{ shiftType.name }</Text>
					{ Boolean(shiftType.system) && (
						<Badge size="sm" variant="light" color="gray">
							System
						</Badge>
					) }
				</Group>
			),
		},
		{
			accessor: "actions",
			title: "Actions",
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			render: (shiftType) => {
				const slug = shiftType.slug || shiftType.id
				const isSystem = Boolean(shiftType.system)

				if(isSystem) {
					return (
						<Text size="sm" c="dimmed">
							Protected
						</Text>
					)
				}

				return (
					<DeleteButton
						label={ shiftType.name }
						disabled={ !slug || deleteCategory.isPending }
						loading={ deleteCategory.isPending }
						onDelete={ () => {
							if(!slug) return
							handleDelete(slug)
						} }
					/>
				)
			},
		},
	]

	return (
		<FormBandStack>
			<FormBand
				title="Existing types"
				description="System types ship with the app and stay put. Custom types can be removed."
			>
				<Table.Provider>
					<Table.DataTable
						classNames={ { table: classes.table } }
						columns={ columns }
						records={ shift_types }
						selectable={ false }
						height="auto"
						emptyState={ (
							<Text size="sm" c="dimmed">
								No shift types yet. Add one below.
							</Text>
						) }
					/>
				</Table.Provider>
			</FormBand>

			<FormBand
				title="Add shift type"
				description="Create a custom category for scheduling and overtime rules."
			>
				<Group align="flex-end" gap="sm" wrap="nowrap" className={ classes.addForm }>
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
			</FormBand>
		</FormBandStack>
	)
}
