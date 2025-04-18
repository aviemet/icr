import { Table } from "@mantine/core"

import { useTableContext } from "../TableContext"
import HeadCellWithContext from "./HeadCellWithContext"

import { type TableHeadCellProps } from "."

const HeadCell = ({ children, ...props }: TableHeadCellProps) => {
	const tableState = useTableContext(false)

	if(tableState === null) {
		return <Table.Th { ...props }>{ children }</Table.Th>
	}

	const { tableState: { rows } } = tableState

	return (
		<HeadCellWithContext { ...props } rows={ rows }>
			{ children }
		</HeadCellWithContext>
	)
}

export default HeadCell
