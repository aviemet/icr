import { Table } from "@mantine/core"
import clsx from "clsx"
import React, { useRef } from "react"

import { type TableCellProps } from "."


export interface BodyCellWithContextProps extends Omit<TableCellProps, "hideable"> {
	hideable?: false | string
	model?: string
}

const BodyCellWithContext = ({ children, nowrap, fitContent, hideable, model, style, className, ...props }: BodyCellWithContextProps) => {
	const tdRef = useRef<HTMLTableCellElement>(null)

	return (
		<Table.Td
			ref={ tdRef }
			className={ clsx({ "table-column-fit": fitContent }, className) }
			style={ [{ whiteSpace: nowrap ? "nowrap" : "normal" }, style ] }
			{ ...props }
		>
			{ children }
		</Table.Td>
	)
}

export default BodyCellWithContext
