import React from "react"

import { useTableSectionContext } from "../TableContext"
import BodyRow from "./BodyRow"
import HeadRow from "./HeadRow"

import { type TableRow } from "./index"


interface RowInContextProps extends Omit<TableRow, "ref"> {
	ref?: React.Ref<HTMLTableRowElement>
	name?: string
	rows?: Record<string, any>[]
	selectable: boolean
	selected: Set<string>
}

const RowInContext = ({ children, ref, ...props }: RowInContextProps) => {
	const { section } = useTableSectionContext()

	return section === "head" ?
		<HeadRow ref={ ref } { ...props }>{ children }</HeadRow>
		:
		<BodyRow ref={ ref } { ...props }>{ children }</BodyRow>
}

export default RowInContext
