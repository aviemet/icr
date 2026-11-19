import { Table, type TableTheadProps } from "@mantine/core"
import { type Ref } from "react"

export interface HeadProps extends TableTheadProps {
	ref?: Ref<HTMLTableSectionElement>
}

export function Head({ children, ref, ...props }: HeadProps) {
	return (
		<Table.Thead
			ref={ ref }
			{ ...props }
		>
			{ children }
		</Table.Thead>
	)
}
