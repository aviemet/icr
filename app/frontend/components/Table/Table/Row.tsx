import { Table, type TableTrProps } from "@mantine/core"
import { type Ref } from "react"

export interface RowProps extends TableTrProps {
	children?: React.ReactNode
	ref?: Ref<HTMLTableRowElement>
}

export function Row({ children, ref, ...props }: RowProps) {
	return (
		<Table.Tr { ...props } ref={ ref }>
			{ children }
		</Table.Tr>
	)
}
