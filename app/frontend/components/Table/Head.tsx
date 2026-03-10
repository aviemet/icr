import { Table, type TableTheadProps } from "@mantine/core"
import React from "react"

import { TableSectionContextProvider } from "./TableContext"

interface TableHead extends TableTheadProps {
	ref?: React.Ref<HTMLTableSectionElement>
}

export function Head({ children, ref, ...props }: TableHead) {
	return (
		<TableSectionContextProvider value={ { section: "head" } }>
			<Table.Thead
				ref={ ref }
				{ ...props }
			>
				{ children }
			</Table.Thead>
		</TableSectionContextProvider>
	)
}
