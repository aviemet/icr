import { createContext } from "@/lib/hooks"

export type TableContextColumn = {
	accessor: string
	title: string
	hideable?: boolean
}

export interface TableContextValue {
	model?: string
	searching: boolean
	setSearching: (searching: boolean) => void
	selectable: boolean
	selectedRecordIds: string[]
	setSelectedRecordIds: (recordIds: string[]) => void
	columns: TableContextColumn[]
	setColumns: (columns: TableContextColumn[]) => void
	columnHide: Record<string, boolean>
	pagination?: Schema.Pagination
}

const [useTableContext, TableContextProvider] = createContext<TableContextValue>()

export { useTableContext, TableContextProvider }
