import { DataTable, type TableDataTableProps } from "./DataTable"
import { Pagination } from "./Pagination"
import { TableProvider, useTableContext, useTableSectionContext } from "./Provider"
import { SearchInput, AdvancedSearch, useAdvancedSearch, SearchDateInput, SearchDateTypeInput } from "./SearchInput"
import { Section } from "./Section"
import { Table as TableBase, Head, Body, Footer, Row, Cell, HeadCell } from "./Table"

export {
	DataTable, type TableDataTableProps,
	Section,
	SearchInput,
	AdvancedSearch,
	useAdvancedSearch,
	SearchDateInput,
	SearchDateTypeInput,
	useTableSectionContext,
	Pagination,
	TableProvider,
	useTableContext,
}

export const Table = Object.assign(TableBase, {
	DataTable,
	Section,
	SearchInput,
	Pagination,
	Head,
	Body,
	Footer,
	Row,
	Cell,
	HeadCell,
	Provider: TableProvider,
	TableProvider,
})

export { type DataTableColumn as TableColumn } from "mantine-datatable"
