import { router } from "@inertiajs/react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import {
	Badge,
	Button,
	Group,
	Text,
	type TableColumn,
	Table, DataTable,
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
	const { t } = useTranslation()
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
			title: t("views.settings.calendar.shift_types_column_name"),
			render: (shiftType) => (
				<Group gap="sm">
					<Text fw={ 500 }>{ shiftType.name }</Text>
					{ Boolean(shiftType.system) && (
						<Badge size="sm" variant="light" color="gray">
							{ t("views.settings.calendar.shift_types_system_badge") }
						</Badge>
					) }
				</Group>
			),
		},
		{
			accessor: "actions",
			title: t("views.settings.calendar.shift_types_column_actions"),
			titleClassName: "actionsCell",
			cellsClassName: "actionsCell",
			render: (shiftType) => {
				const slug = shiftType.slug || shiftType.id
				const isSystem = Boolean(shiftType.system)

				if(isSystem) {
					return (
						<Text size="sm" c="dimmed">
							{ t("views.settings.calendar.shift_types_protected") }
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
				title={ t("views.settings.calendar.shift_types_existing_title") }
				description={ t("views.settings.calendar.shift_types_existing_description") }
			>
				<Table.Provider>
					<DataTable
						classNames={ { table: classes.table } }
						columns={ columns }
						records={ shift_types }
						selectable={ false }
						height="auto"
						emptyState={ (
							<Text size="sm" c="dimmed">
								{ t("views.settings.calendar.shift_types_empty") }
							</Text>
						) }
					/>
				</Table.Provider>
			</FormBand>

			<FormBand
				title={ t("views.settings.calendar.shift_types_add_title") }
				description={ t("views.settings.calendar.shift_types_add_description") }
			>
				<Group align="flex-end" gap="sm" wrap="nowrap" className={ classes.addForm }>
					<TextInput
						id="new-shift-type-name"
						label={ t("views.settings.calendar.shift_types_name_label") }
						value={ newName }
						onChange={ event => setNewName(event.currentTarget.value) }
						placeholder={ t("views.settings.calendar.shift_types_name_placeholder") }
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
						{ t("views.settings.calendar.shift_types_add_button") }
					</Button>
				</Group>
			</FormBand>
		</FormBandStack>
	)
}
