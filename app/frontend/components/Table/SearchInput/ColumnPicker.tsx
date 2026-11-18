import { router } from "@inertiajs/react"
import { ActionIcon, Checkbox, Menu, Tooltip } from "@mantine/core"

import { ColumnsIcon } from "@/components/Icons"
import { usePageProps } from "@/lib/hooks/usePageProps"
import { useUpdateTablePreferences } from "@/queries"

import { useTableContext } from "../Provider"
import * as classes from "./SearchInput.css"

export function ColumnPicker() {
	const context = useTableContext(false)
	const model = context?.model
	const columns = context?.columns ?? []
	const { auth: { user } } = usePageProps()
	const mutate = useUpdateTablePreferences({ params: { userId: String(user.slug) } })

	const hideableColumns = columns.filter(column => (
		column.hideable !== false &&
		column.title.trim() !== "" &&
		column.accessor !== "actions"
	))

	if(!model || hideableColumns.length === 0) {
		return null
	}

	const hide = user.table_preferences?.[model]?.hide ?? {}
	const limitValue = user.table_preferences?.[model]?.limit
	const limit = limitValue === undefined || limitValue === null
		? undefined
		: String(limitValue)

	const toggleColumn = (accessor: string, currentlyHidden: boolean) => {
		const nextHide: Record<string, boolean> = { ...hide }

		if(currentlyHidden) {
			delete nextHide[accessor]
		} else {
			nextHide[accessor] = true
		}

		mutate.mutate({
			[model]: {
				hide: nextHide,
				...(limit !== undefined ? { limit } : {}),
			},
		}, {
			onSuccess: () => {
				router.reload()
			},
		})
	}

	return (
		<Menu shadow="md" width={ 220 } position="bottom-end" withinPortal>
			<Menu.Target>
				<Tooltip label="Columns" withArrow position="bottom">
					<ActionIcon
						size={ 36 }
						variant="default"
						className={ classes.columnPickerButton }
						aria-label="Toggle columns"
					>
						<ColumnsIcon size={ 18 } />
					</ActionIcon>
				</Tooltip>
			</Menu.Target>
			<Menu.Dropdown>
				{ hideableColumns.map(column => {
					const isHidden = Boolean(hide[column.accessor])
					return (
						<Menu.Item
							key={ column.accessor }
							closeMenuOnClick={ false }
							onClick={ () => toggleColumn(column.accessor, isHidden) }
							leftSection={ (
								<Checkbox
									checked={ !isHidden }
									readOnly
									tabIndex={ -1 }
									aria-hidden
								/>
							) }
						>
							{ column.title }
						</Menu.Item>
					)
				}) }
			</Menu.Dropdown>
		</Menu>
	)
}
