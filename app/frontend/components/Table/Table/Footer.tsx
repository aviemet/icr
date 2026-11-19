import { Table, type TableTfootProps } from "@mantine/core"
import { type Ref } from "react"

export interface FooterProps extends TableTfootProps {
	ref?: Ref<HTMLTableSectionElement>
}

export function Footer({ children, ref, ...props }: FooterProps) {
	return (
		<Table.Tfoot
			ref={ ref }
			{ ...props }
		>
			{ children }
		</Table.Tfoot>
	)
}
