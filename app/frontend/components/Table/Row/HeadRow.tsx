import { Table } from "@mantine/core"
import React from "react"

import { useCheckboxState, useInit } from "@/lib/hooks"

import HeadCheckbox from "./HeadCheckbox"
import { useTableContext } from "../TableContext"
import { TableHeadCellProps } from "../Th"

import { type TableRow } from "./index"

interface HeadRowProps extends TableRow {
	ref?: React.Ref<HTMLTableRowElement>
	name?: string
	rows?: Record<string, any>[]
	selectable: boolean
	selected: Set<string>
}

const HeadRow = ({ children, name, rows, selectable, selected, ref, ...props }: HeadRowProps) => {
	const { tableState: { columns }, setTableState } = useTableContext()

	let { length, selectedCount } = { length: 0, selectedCount: 0 }
	if(selectable) {
		length = rows?.length || 0
		selectedCount = selected.size || 0
	}
	const { allChecked, indeterminate } = useCheckboxState(length, selectedCount)

	// Register hideable attributes in context
	useInit(() => {
		if(!children) return

		React.Children.forEach(children, (child, index) => {
			if(!React.isValidElement<TableHeadCellProps>(child)) return

			const { props: childProps } = child
			const hideable = String(childProps.hideable ?? childProps.sort ?? "")
			columns[index] = { label: String(childProps.children ?? ""), hideable }
		})

		setTableState({ columns })
	})

	return (
		<Table.Tr { ...props } ref={ ref }>
			{ selectable && <HeadCheckbox
				rows={ rows }
				selected={ selected }
				allChecked={ allChecked }
				indeterminate={ indeterminate }
			/> }
			{ children }
		</Table.Tr>
	)
}

export default HeadRow
