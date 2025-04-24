import { Table, type TableProps as MantineTableProps } from "@mantine/core"
import clsx from "clsx"

import Body from "./Body"
import Footer from "./Footer"
import Head from "./Head"
import Pagination from "./Pagination"
import Row from "./Row"
import RowIterator from "./RowIterator"
import SearchInput from "./SearchInput"
import TableSection from "./Section"
import TableProvider, { useTableContext } from "./TableContext"
import Cell from "./Td"
import HeadCell from "./Th"
import ConditionalWrapper from "../ConditionalWrapper"
import * as classes from "./Table.css"

export interface TableProps extends MantineTableProps {
	fixed?: boolean
	wrapper?: boolean
}

type TableComponent = ((props: TableProps) => JSX.Element)

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

export type TableObject = TableComponent & TableObjects

const TableComponent: TableObject = ({
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
				<Table
					striped={ striped }
					highlightOnHover={ highlightOnHover }
					className={ clsx(className, classes.table) }
					style={ [wrapper ? { thead: { top: - 10 } } : undefined, style] }
					{ ...props }
				>
					{ children }
				</Table>
			</ConditionalWrapper>
		</ConditionalWrapper>
	)
}

TableComponent.TableProvider = TableProvider
TableComponent.Section = TableSection
TableComponent.SearchInput = SearchInput
TableComponent.Head = Head
TableComponent.HeadCell = HeadCell
TableComponent.Body = Body
TableComponent.Cell = Cell
TableComponent.Row = Row
TableComponent.RowIterator = RowIterator
TableComponent.Footer = Footer
TableComponent.Pagination = Pagination

export default TableComponent
