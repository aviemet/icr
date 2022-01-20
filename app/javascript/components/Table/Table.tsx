import React from 'react'
import Head, { HeaderCell } from './Head'
import Body, { BodyCell } from './Body'
import Row from './Row'
import Cell from './Cell'

type TableCell = typeof HeaderCell | typeof BodyCell

export const CellParentContext = React.createContext<TableCell>(HeaderCell)
export const useCellParent = () => React.useContext(CellParentContext)

interface TableComponent extends React.FunctionComponent{
	Head: typeof Head
	Row: typeof Row
	Cell: typeof Cell
	Body: typeof Body
}

const Table: TableComponent = ({ children }) => {
	return <table>{ children }</table>
}

Table.Head = Head
Table.Row = Row
Table.Cell = Cell
Table.Body = Body

export default Table
