import { createContext } from "@/lib/hooks"

export interface TableDataContextValue {
	data: readonly unknown[]
	emptyMessage: React.ReactNode
	headCellCount: number
	registerHeadCell: () => () => void
}

const [useTableDataContext, TableDataContextProvider] = createContext<TableDataContextValue>()

export { useTableDataContext, TableDataContextProvider }
