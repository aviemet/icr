import { createContext } from "@/lib/hooks"

const [useTableSectionContext, TableSectionContextProvider] = createContext<Record<string, never>>()

export { useTableSectionContext, TableSectionContextProvider }
