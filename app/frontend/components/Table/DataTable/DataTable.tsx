import { router } from "@inertiajs/react"
import { LoadingOverlay } from "@mantine/core"
import clsx from "clsx"
import { DataTable as MantineDataTable, type DataTableProps, type DataTableSortStatus } from "mantine-datatable"
import { useCallback, useMemo, useState } from "react"

import { useLocation } from "@/lib/hooks"

import * as classes from "./DataTable.css"
import { Pagination } from "../Pagination"
import { useTableContext } from "../Provider"

const isValidDirection = (value: string | undefined): value is "asc" | "desc" => {
	return value === "asc" || value === "desc"
}

export type TableDataTableProps<T = Record<string, unknown>> = Omit<DataTableProps<T>, "selectedRecords" | "onSelectedRecordsChange"> & {
	pagination?: Schema.Pagination
	model?: string
	selectable?: boolean
	onSortChange?: (field: string | null, direction: "asc" | "desc" | null) => void
	onSelectedRecordsChange?: (records: T[]) => void
}

export function DataTable<T = Record<string, unknown>>({
	columns = [],
	records,
	pagination,
	model,
	selectable = false,
	onSortChange,
	onSelectedRecordsChange,
	classNames,
	withTableBorder = true,
	withColumnBorders = true,
	...props
}: TableDataTableProps<T>) {
	const context = useTableContext(false)
	const searching = context?.searching ?? false

	const [selectedRecords, setSelectedRecords] = useState<T[]>([])

	const location = useLocation()


	const sortStatus = useMemo<DataTableSortStatus<T> | undefined>(() => {
		if(!pagination || !model) return undefined

		const sort = location.paramsAsJson.sort
		const direction = location.paramsAsJson.direction

		if(!sort || !isValidDirection(direction)) return undefined

		return {
			columnAccessor: sort,
			direction: direction,
		}
	}, [location.paramsAsJson.sort, location.paramsAsJson.direction, pagination, model])

	const handleSortStatusChange = useCallback((status: DataTableSortStatus<T>) => {
		if(onSortChange) {
			onSortChange(String(status.columnAccessor), status.direction ?? null)
			return
		}

		if(pagination && model) {
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
		}
	}, [onSortChange, pagination, model])

	const handleSelectedRecordsChange = useCallback((newSelected: T[]) => {
		setSelectedRecords(newSelected)
		onSelectedRecordsChange?.(newSelected)
	}, [onSelectedRecordsChange])

	return (
		<div style={ { position: "relative", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 } }>
			{ searching && (
				<LoadingOverlay visible={ searching } overlayProps={ { blur: 1 } } />
			) }
			{ /* @ts-ignore - MantineDataTable interface doesn't support safe prop proxying */ }
			<MantineDataTable
				// @ts-ignore - MantineDataTable interface doesn't support safe prop proxying
				stickyHeader
				classNames={ {
					table: clsx(classes.table, classNames?.table),
					root: clsx(classes.root, classNames?.root),
					header: clsx(classes.header, classNames?.header),
					footer: classNames?.footer,
					pagination: classNames?.pagination,
				} }
				columns={ columns }
				records={ records }
				onSortStatusChange={ handleSortStatusChange }
				sortStatus={ sortStatus }
				emptyState={ <></> }
				height="100%"
				scrollAreaProps={ {
					offsetScrollbars: false,
				} }
				renderPagination={ pagination && model
					? () => <Pagination pagination={ pagination } model={ model } />
					: undefined
				}
				{ ...(selectable
					? {
						selectedRecords,
						onSelectedRecordsChange: handleSelectedRecordsChange,
						idAccessor: "id",
					}
					: {}
				) }
				{ ...props }
			/>
		</div>
	)
}
