import React, { useState, useCallback } from "react"

import { createContext } from "@/lib/hooks"

interface TableContextValue<T extends Record<string, unknown> = Record<string, unknown>> {
	model?: string
	searching: boolean
	setSearching: (searching: boolean) => void
	selectable: boolean
	selectedRecordIds: string[]
	setSelectedRecordIds: (recordIds: string[]) => void
	records?: readonly T[]
	columns?: Array<{ accessor: string, title: string }>
	pagination?: Schema.Pagination
}

const [useTableContext, TableContextProvider] = createContext<TableContextValue>()
export { useTableContext }

interface TableProviderProps<T extends Record<string, unknown> = Record<string, unknown>> {
	children: React.ReactNode
	model?: string
	selectable?: boolean
	records?: readonly T[]
	columns?: Array<{ accessor: string, title: string }>
	pagination?: Schema.Pagination
}

export function TableProvider<T extends Record<string, unknown> = Record<string, unknown>>({
	children,
	model,
	selectable = false,
	records,
	columns,
	pagination,
}: TableProviderProps<T>) {
	const [searching, setSearching] = useState(false)
	const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([])

	const handleSetSearching = useCallback((value: boolean) => {
		setSearching(value)
	}, [])

	return (
		<TableContextProvider value={ {
			model,
			searching,
			setSearching: handleSetSearching,
			selectable,
			selectedRecordIds,
			setSelectedRecordIds,
			records,
			columns,
			pagination,
		} }>
			{ children }
		</TableContextProvider>
	)
}
