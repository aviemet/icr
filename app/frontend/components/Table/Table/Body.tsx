import { Table, type TableTbodyProps } from "@mantine/core"
import { type Ref } from "react"

export interface BodyProps extends TableTbodyProps {
	ref?: Ref<HTMLTableSectionElement>
}

export function Body({ children, ref, ...props }: BodyProps) {
	return (
		<Table.Tbody { ...props } ref={ ref }>
			{ children }
		</Table.Tbody>
	)
}
