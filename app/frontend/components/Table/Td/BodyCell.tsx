import { Table } from "@mantine/core"

import { useTableContext } from "../TableContext"
import { BodyCellWithContext } from "./BodyCellWithContext"

import { type TableCellProps } from "."

export function BodyCell({ children, ...props }: TableCellProps) {
	const tableState = useTableContext(false)

	if(tableState === null) {
		return <Table.Td { ...props }>{ children }</Table.Td>
	}

	const { tableState: { model } } = tableState

	return <BodyCellWithContext model={ model } { ...props }>
		{ children }
	</BodyCellWithContext>
}
