import { type TableThProps } from "@mantine/core"

import { usePageProps } from "@/lib/hooks"

import { useTableContext } from "../TableContext"
import { HeadCell as InnerHeadCell } from "./HeadCell"

export interface TableHeadCellProps extends TableThProps {
	fitContent?: boolean
	sort?: string
	nowrap?: boolean
	hideable?: false | string
	ref?: React.RefObject<HTMLTableCellElement>
}

export function HeadCell({ children = true, hideable, sort, ...props }: TableHeadCellProps) {
	const { auth: { user: { table_preferences } } } = usePageProps()

	const tableState = useTableContext(false)

	let hiddenByUser: boolean = false

	if(tableState !== null) {
		const { tableState: { model } } = tableState

		const hideableString = hideable || sort
		if(hideableString !== undefined && model !== undefined) {
			hiddenByUser = table_preferences?.[model]?.hide?.[hideableString]
		}
	}

	if(hiddenByUser) return <></>

	return <InnerHeadCell hideable={ hideable } sort={ sort } { ...props }>{ children }</InnerHeadCell>
}
