import { Table, type TableThProps } from "@mantine/core"
import { type Ref } from "react"

export interface HeadCellProps extends TableThProps {
	children?: React.ReactNode
	ref?: Ref<HTMLTableCellElement>
}

export function HeadCell({ children, ref, ...props }: HeadCellProps) {
	return (
		<Table.Th { ...props } ref={ ref }>
			{ children }
		</Table.Th>
	)
}
