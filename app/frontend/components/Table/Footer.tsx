import { Table, type TableTfootProps } from "@mantine/core"
import React from "react"

import { TableSectionContextProvider } from "./TableContext"

interface TableFooterProps extends TableTfootProps {
	ref?: React.Ref<HTMLTableSectionElement>
}

const Footer = ({ children, ref, ...props }: TableFooterProps) => {
	return (
		<TableSectionContextProvider value={ { section: "footer" } }>
			<Table.Tfoot { ...props } ref={ ref }>
				{ children }
			</Table.Tfoot>
		</TableSectionContextProvider>
	)
}

export default Footer
