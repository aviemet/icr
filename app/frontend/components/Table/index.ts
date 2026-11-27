import {
	DateRangeFilterInput,
	emptyDateRangeFilterValue,
	type DateRangeFilterValue,
} from "./Filters"
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
import { Table as TableBase, Head, Body, Footer, Row, Cell, HeadCell, RowIterator, type TableProps } from "./Table"
import { useServerTableFilters } from "./useServerTableFilters"

export {
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
	DateRangeFilterInput,
	emptyDateRangeFilterValue,
	type DateRangeFilterValue,
	type ServerTableFilterField,
	type ServerTableFilterValues,
}

export const Table = Object.assign(TableBase, {
	Section,
	SearchInput,
	Pagination,
	Head,
	Body,
	Footer,
	Row,
	Cell,
	HeadCell,
	RowIterator,
	Provider: TableProvider,
})

export { type TableProps }
