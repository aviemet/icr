import { Table, type TableTdProps } from "@mantine/core"
import { forwardRef } from "react"

export interface CellProps extends TableTdProps {
	children?: React.ReactNode
	nowrap?: boolean
}

export const Cell = forwardRef<HTMLTableCellElement, CellProps>(({ children, nowrap, style, ...props }, ref) => {
	return (
		<Table.Td { ...props } ref={ ref } style={ nowrap ? { ...style, whiteSpace: "nowrap" } : style }>
			{ children }
		</Table.Td>
	)
})

Cell.displayName = "Table.Cell"
