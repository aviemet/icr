import { router } from "@inertiajs/react"
import { Avatar, Box, LoadingOverlay, type CheckboxProps } from "@mantine/core"
import clsx from "clsx"
import {
	DataTable as MantineDataTable,
	type DataTableColumn,
	type DataTableProps,
	type DataTableSortStatus,
} from "mantine-datatable"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import { CheckIcon } from "@/components/Icons"
import { useTableContext, type TableContextColumn } from "@/components/Table/Provider"
import { useLocation } from "@/lib/hooks/useLocation"

import * as classes from "./DataTable.css"

const isValidDirection = (value: string | undefined): value is "asc" | "desc" => {
	return value === "asc" || value === "desc"
}

const recordId = (record: object): string => {
	if("id" in record && record.id !== null && record.id !== undefined) {
		return String(record.id)
	}

	return ""
}

export type SelectionAvatarProps = {
	color?: string
	initials: string
}

export type TableDataTableProps<T extends object = Record<string, unknown>> = {
	columns?: DataTableColumn<T>[]
	records?: T[]
	model?: string
	selectable?: boolean
	selectionAvatar?: (record: T) => SelectionAvatarProps
	height?: DataTableProps<T>["height"]
	emptyState?: ReactNode
	classNames?: DataTableProps<T>["classNames"]
	withTableBorder?: boolean
	withColumnBorders?: boolean
	rowBackgroundColor?: DataTableProps<T>["rowBackgroundColor"]
	onSortChange?: (field: string | null, direction: "asc" | "desc" | null) => void
	onSelectedRecordsChange?: (records: T[]) => void
}

export function DataTable<T extends object = Record<string, unknown>>({
	columns = [],
	records,
	model: modelProp,
	selectable = false,
	selectionAvatar,
	onSortChange,
	onSelectedRecordsChange,
	classNames,
	withTableBorder = true,
	withColumnBorders = true,
	emptyState = <></>,
	height = "100%",
	rowBackgroundColor,
}: TableDataTableProps<T>) {
	const context = useTableContext(false)
	const searching = context?.searching ?? false
	const model = modelProp ?? context?.model

	const [selectedRecords, setSelectedRecords] = useState<T[]>([])

	const location = useLocation()

	const setColumns = context?.setColumns

	useEffect(() => {
		if(!setColumns) return

		const nextColumns: TableContextColumn[] = columns.flatMap(column => {
			const accessor = column.accessor
			if(accessor === undefined || accessor === null) return []

			const title = typeof column.title === "string" ? column.title : String(column.title ?? "")
			return [{
				accessor: String(accessor),
				title,
				hideable: column.accessor !== "actions" && title.trim() !== "",
			}]
		})

		setColumns(nextColumns)
	}, [columns, setColumns])

	const visibleColumns = useMemo(() => {
		const columnHide = context?.columnHide ?? {}
		return columns
			.filter(column => {
				const accessor = column.accessor
				if(accessor === undefined || accessor === null) return true
				return !columnHide[String(accessor)]
			})
			.map(column => {
				const isActionsColumn =
					column.accessor === "actions" ||
					column.titleClassName === "actionsCell" ||
					column.cellsClassName === "actionsCell"

				if(!isActionsColumn) return column

				return {
					...column,
					textAlign: column.textAlign ?? "center",
					titleClassName: column.titleClassName ?? "actionsCell",
					cellsClassName: column.cellsClassName ?? "actionsCell",
				}
			})
	}, [columns, context?.columnHide])

	const sortStatus = useMemo<DataTableSortStatus<T>>(() => {
		if(!model) {
			return {
				columnAccessor: "",
				direction: "asc",
			}
		}

		const sort = location.paramsAsJson.sort
		const direction = location.paramsAsJson.direction

		if(!sort || !isValidDirection(direction)) {
			return {
				columnAccessor: "",
				direction: "asc",
			}
		}

		return {
			columnAccessor: sort,
			direction: direction,
		}
	}, [location.paramsAsJson.sort, location.paramsAsJson.direction, model])

	const handleSortStatusChange = useCallback((status: DataTableSortStatus<T>) => {
		if(onSortChange) {
			onSortChange(String(status.columnAccessor), status.direction ?? null)
			return
		}

		if(!model) return

		const url = new URL(window.location.href)
		if(status.direction) {
			url.searchParams.set("sort", String(status.columnAccessor))
			url.searchParams.set("direction", status.direction)
		} else {
			url.searchParams.delete("sort")
			url.searchParams.delete("direction")
		}

		router.get(url.toString(), {}, {
			preserveState: true,
			preserveScroll: true,
			replace: true,
		})
	}, [onSortChange, model])

	const handleSelectedRecordsChange = useCallback((newSelected: T[]) => {
		setSelectedRecords(newSelected)
		onSelectedRecordsChange?.(newSelected)
		context?.setSelectedRecordIds(newSelected.map(recordId))
	}, [context, onSelectedRecordsChange])

	if(context && context.selectedRecordIds.length === 0 && selectedRecords.length > 0) {
		setSelectedRecords([])
	}

	const getRecordSelectionCheckboxProps = useCallback((record: T): CheckboxProps => {
		if(!selectionAvatar) {
			return {
				"aria-label": `Select record ${recordId(record)}`,
			}
		}

		const { color, initials } = selectionAvatar(record)
		const selected = selectedRecords.some(selectedRecord => recordId(selectedRecord) === recordId(record))

		return {
			"aria-label": `Select ${initials}`,
			className: classes.avatarCheckbox,
			label: (
				<Avatar
					radius="xl"
					size="sm"
					color={ color ?? "gray" }
					className={ clsx(classes.selectionAvatar, {
						[classes.selectionAvatarSelected]: selected,
					}) }
				>
					{ selected ? <CheckIcon size={ 14 } /> : <span className={ classes.selectionAvatarInitials }>{ initials }</span> }
				</Avatar>
			),
			styles: {
				body: { alignItems: "center", gap: 0 },
				inner: { display: "none" },
				input: {
					position: "absolute",
					opacity: 0,
					width: 0,
					height: 0,
					margin: 0,
					padding: 0,
				},
				label: { padding: 0, cursor: "pointer" },
			},
		}
	}, [selectionAvatar, selectedRecords])

	return (
		<Box style={ { position: "relative", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } }>
			{ searching && (
				<LoadingOverlay visible={ searching } overlayProps={ { blur: 1 } } />
			) }
			<MantineDataTable
				classNames={ {
					table: clsx(classes.table, classNames?.table),
					root: clsx(classes.root, classNames?.root),
					header: clsx(classes.header, classNames?.header),
					footer: classNames?.footer,
					pagination: classNames?.pagination,
				} }
				columns={ visibleColumns }
				records={ records }
				sortStatus={ sortStatus }
				onSortStatusChange={ handleSortStatusChange }
				emptyState={ emptyState }
				height={ height }
				scrollAreaProps={ {
					offsetScrollbars: false,
				} }
				verticalAlign="center"
				withTableBorder={ withTableBorder }
				withColumnBorders={ withColumnBorders }
				rowBackgroundColor={ rowBackgroundColor }

				{ ...(selectable
					? {
						selectedRecords,
						onSelectedRecordsChange: handleSelectedRecordsChange,
						idAccessor: "id",
						selectionColumnClassName: selectionAvatar ? classes.avatarSelectionColumn : undefined,
						getRecordSelectionCheckboxProps,
						allRecordsSelectionCheckboxProps: {
							"aria-label": "Select all records",
						},
					}
					: {}
				) }
			/>
		</Box>
	)
}
