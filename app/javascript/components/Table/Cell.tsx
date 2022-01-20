import React from 'react'
import { useCellParent } from './Table'

const Cell = ({ children }) => {
	const TableCell = useCellParent()

	return <TableCell>{ children }</TableCell>
}

export default Cell
