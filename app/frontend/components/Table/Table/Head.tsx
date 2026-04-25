import { Table, type TableTheadProps } from "@mantine/core"
import { forwardRef } from "react"

export const Head = forwardRef<HTMLTableSectionElement, TableTheadProps>((
	{ children, ...props },
	ref,
) => {
	return (
		<Table.Thead
			ref={ ref }
			{ ...props }
		>
			{ children }
		</Table.Thead>
	)
})

Head.displayName = "Table.Head"
