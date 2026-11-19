import { Table, type TableTdProps } from "@mantine/core"
import { type Ref } from "react"

export interface CellProps extends TableTdProps {
	children?: React.ReactNode
	nowrap?: boolean
	ref?: Ref<HTMLTableCellElement>
}

export function Cell({ children, nowrap, style, ref, ...props }: CellProps) {
	return (
		<Table.Td { ...props } ref={ ref } style={ nowrap ? { ...style, whiteSpace: "nowrap" } : style }>
			{ children }
		</Table.Td>
	)
}
