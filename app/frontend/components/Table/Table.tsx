import {
	Table as MantineTable,
	type TableProps as MantineTableProps,
} from "@mantine/core"
import clsx from "clsx"

import { Body } from "./Body"
import { Footer } from "./Footer"
import { Head } from "./Head"
import { Pagination } from "./Pagination"
import { Row } from "./Row"
import { RowIterator } from "./RowIterator"
import { SearchInput } from "./SearchInput"
import { TableSection } from "./Section"
import { TableProvider, useTableContext } from "./TableContext"
import { Td as Cell } from "./Td"
import { HeadCell } from "./Th"
import { ConditionalWrapper } from "../ConditionalWrapper"
import * as classes from "./Table.css"

export interface TableProps extends MantineTableProps {
	fixed?: boolean
	wrapper?: boolean
}

type Table = ((props: TableProps) => JSX.Element)

type TableObjects = {
	Head: typeof Head
	Body: typeof Body
	RowIterator: typeof RowIterator
	Row: typeof Row
	Cell: typeof Cell
	HeadCell: typeof HeadCell
	Footer: typeof Footer
	Pagination: typeof Pagination
	TableProvider: typeof TableProvider
	Section: typeof TableSection
	SearchInput: typeof SearchInput
}

export type TableObject = Table & TableObjects

const Table: TableObject = ({
	children,
	className,
	wrapper = true,
	fixed = false,
	striped = true,
	highlightOnHover = true,
	style,
	...props
}) => {
	const tableState = useTableContext(false)

	return (
		<ConditionalWrapper
			condition={ wrapper }
			wrapper={ children => <div className={ classes.wrapper }>{ children }</div> }
		>
			<ConditionalWrapper
				condition={ tableState === null }
				wrapper={ children => <TableProvider>{ children }</TableProvider> }
			>
				<MantineTable
					striped={ striped }
					highlightOnHover={ highlightOnHover }
					className={ clsx(className, classes.table) }
					style={ [wrapper ? { thead: { top: - 10 } } : undefined, style] }
					{ ...props }
				>
					{ children }
				</MantineTable>
			</ConditionalWrapper>
		</ConditionalWrapper>
	)
}

Table.TableProvider = TableProvider
Table.Section = TableSection
Table.SearchInput = SearchInput
Table.Head = Head
Table.HeadCell = HeadCell
Table.Body = Body
Table.Cell = Cell
Table.Row = Row
Table.RowIterator = RowIterator
Table.Footer = Footer
Table.Pagination = Pagination

export { Table }
