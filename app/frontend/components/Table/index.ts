import { DataTable, type TableDataTableProps } from "./DataTable"
import { Pagination } from "./Pagination"
import { TableProvider, useTableContext, useTableSectionContext } from "./Provider"
import { SearchInput } from "./SearchInput"
import { Section } from "./Section"
import {
	defaultServerTableFilterValues,
	readServerTableFilters,
	writeServerTableFilters,
	type ServerTableFilterField,
	type ServerTableFilterValues,
} from "./serverTableFilters"
import { Table as TableBase, Head, Body, Footer, Row, Cell, HeadCell, type TableProps } from "./Table"
import { useServerTableFilters } from "./useServerTableFilters"

export {
	DataTable, type TableDataTableProps,
	Section,
	SearchInput,
	useTableSectionContext,
	Pagination,
	TableProvider,
	useTableContext,
	readServerTableFilters,
	writeServerTableFilters,
	defaultServerTableFilterValues,
	useServerTableFilters,
	type ServerTableFilterField,
	type ServerTableFilterValues,
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
})

export { type DataTableColumn as TableColumn } from "mantine-datatable"
export { type TableProps }
