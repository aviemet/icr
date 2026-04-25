import { Table, type TableTrProps } from "@mantine/core"
import { forwardRef } from "react"

export interface RowProps extends TableTrProps {
	children?: React.ReactNode
}

export const Row = forwardRef<HTMLTableRowElement, RowProps>(({ children, ...props }, ref) => {
	return (
		<Table.Tr { ...props } ref={ ref }>
			{ children }
		</Table.Tr>
	)
})

Row.displayName = "Table.Row"
