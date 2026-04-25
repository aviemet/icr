import { Table, type TableTbodyProps } from "@mantine/core"
import { forwardRef } from "react"

export const Body = forwardRef<HTMLTableSectionElement, TableTbodyProps>(({ children, ...props }, ref) => {
	return (
		<Table.Tbody { ...props } ref={ ref }>
			{ children }
		</Table.Tbody>
	)
})

Body.displayName = "Table.Body"
