import { Table, type TableThProps } from "@mantine/core"
import { forwardRef } from "react"

export interface HeadCellProps extends TableThProps {
	children?: React.ReactNode
}

export const HeadCell = forwardRef<HTMLTableCellElement, HeadCellProps>(({ children, ...props }, ref) => {
	return (
		<Table.Th { ...props } ref={ ref }>
			{ children }
		</Table.Th>
	)
})

HeadCell.displayName = "Table.HeadCell"
