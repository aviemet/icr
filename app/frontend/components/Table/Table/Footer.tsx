import { Table, type TableTfootProps } from "@mantine/core"
import { forwardRef } from "react"

export const Footer = forwardRef<HTMLTableSectionElement, TableTfootProps>((
	{ children, ...props },
	ref,
) => {
	return (
		<Table.Tfoot
			ref={ ref }
			{ ...props }
		>
			{ children }
		</Table.Tfoot>
	)
})

Footer.displayName = "Table.Footer"
