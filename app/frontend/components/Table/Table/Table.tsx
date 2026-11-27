import { Box, Table as MantineTable, type TableProps as MantineTableProps } from "@mantine/core"
import clsx from "clsx"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { ConditionalWrapper } from "@/components/ConditionalWrapper"

import * as classes from "./Table.css"
import { TableDataContextProvider } from "./TableDataContext"

export interface TableProps extends Omit<MantineTableProps, "children" | "data"> {
	wrapper?: boolean
	fixed?: boolean
	children?: React.ReactNode
	data?: readonly unknown[]
	emptyMessage?: React.ReactNode
}

export function Table({
	children,
	className,
	wrapper = true,
	fixed = false,
	striped = true,
	highlightOnHover = true,
	data = [],
	emptyMessage,
	...props
}: TableProps) {
	const { t } = useTranslation()
	const [headCellCount, setHeadCellCount] = useState(0)
	const resolvedEmptyMessage = emptyMessage ?? t("views.table.empty")

	const registerHeadCell = useCallback(() => {
		setHeadCellCount(count => count + 1)
		return () => {
			setHeadCellCount(count => count - 1)
		}
	}, [])

	const contextValue = useMemo(() => ({
		data,
		emptyMessage: resolvedEmptyMessage,
		headCellCount,
		registerHeadCell,
	}), [data, resolvedEmptyMessage, headCellCount, registerHeadCell])

	return (
		<TableDataContextProvider value={ contextValue }>
			<ConditionalWrapper
				condition={ wrapper }
				wrapper={ children => <Box className={ classes.wrapper }>{ children }</Box> }
			>
				<MantineTable
					striped={ striped }
					highlightOnHover={ highlightOnHover }
					className={ clsx(className, classes.table, { "layout-fixed": fixed }) }
					{ ...props }
				>
					{ children }
				</MantineTable>
			</ConditionalWrapper>
		</TableDataContextProvider>
	)
}
