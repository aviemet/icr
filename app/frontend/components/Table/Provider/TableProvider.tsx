import React, { useState, useCallback } from "react"

import {
	TableContextProvider,
	type TableContextColumn,
} from "./TableContext"

interface TableProviderProps {
	children: React.ReactNode
	model?: string
	selectable?: boolean
	columns?: TableContextColumn[]
	columnHide?: Record<string, boolean>
	pagination?: Schema.Pagination
}

function columnsEqual(left: TableContextColumn[], right: TableContextColumn[]) {
	if(left.length !== right.length) return false

	return left.every((column, index) => {
		const other = right[index]
		return column.accessor === other.accessor &&
			column.title === other.title &&
			column.hideable === other.hideable
	})
}

export function TableProvider({
	children,
	model,
	selectable = false,
	columns: columnsProp,
	columnHide = {},
	pagination,
}: TableProviderProps) {
	const [searching, setSearching] = useState(false)
	const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([])
	const [columns, setColumnsState] = useState<TableContextColumn[]>(columnsProp ?? [])

	const handleSetSearching = useCallback((value: boolean) => {
		setSearching(value)
	}, [])

	const setColumns = useCallback((nextColumns: TableContextColumn[]) => {
		setColumnsState(current => (columnsEqual(current, nextColumns) ? current : nextColumns))
	}, [])

	return (
		<TableContextProvider value={ {
			model,
			searching,
			setSearching: handleSetSearching,
			selectable,
			selectedRecordIds,
			setSelectedRecordIds,
			columns,
			setColumns,
			columnHide,
			pagination,
		} }>
			{ children }
		</TableContextProvider>
	)
}
