import React, { forwardRef } from "react"

import { useTableSectionContext } from "../TableContext"
import BodyRow from "./BodyRow"
import HeadRow from "./HeadRow"

import { type TableRow } from "./index"


interface RowInContextProps extends Omit<TableRow, "ref"> {
	name?: string
	rows?: Record<string, any>[]
	selectable: boolean
	selected: Set<string>
}

const RowInContext = forwardRef<HTMLTableRowElement, RowInContextProps>((
	{ children, ...props },
	ref,
) => {
	const { section } = useTableSectionContext()

	return section === "head" ?
		<HeadRow ref={ ref } { ...props }>{ children }</HeadRow>
		:
		<BodyRow ref={ ref } { ...props }>{ children }</BodyRow>

})

export default RowInContext
