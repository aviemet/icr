import { Table, type TableThProps } from "@mantine/core"
import { type Ref, useLayoutEffect } from "react"

import { useTableDataContext } from "./TableDataContext"

export interface HeadCellProps extends TableThProps {
	children?: React.ReactNode
	ref?: Ref<HTMLTableCellElement>
}

export function HeadCell({ children, ref, ...props }: HeadCellProps) {
	const tableData = useTableDataContext(false)
	const registerHeadCell = tableData?.registerHeadCell

	useLayoutEffect(() => {
		if(!registerHeadCell) return

		return registerHeadCell()
	}, [registerHeadCell])

	return (
		<Table.Th { ...props } ref={ ref }>
			{ children }
		</Table.Th>
	)
}
