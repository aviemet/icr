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
		setColumnsState(nextColumns)
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
