import { Table } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useRef } from "react"

import { Link, Flex } from "@/components"
import { useLocation } from "@/lib/hooks"

import { type TableHeadCellProps } from "."


interface HeadCellWithContextProps extends TableHeadCellProps {
	rows?: Record<string, any>[]
}

export function HeadCellWithContext({
	children,
	fitContent = false,
	sort,
	nowrap = true,
	rows,
	hideable,
	style,
	...props
}: HeadCellWithContextProps) {
	const thRef = useRef<HTMLTableCellElement>(null)
	const { pathname, params } = useLocation()

	const paramsSort = params.get("sort")
	const paramsDirection = params.get("direction")

	const currentDirection = paramsSort === sort && (paramsDirection === "asc" || paramsDirection === "desc")
		? paramsDirection
		: undefined
	const nextDirection = currentDirection === "asc" ? "desc" : "asc"

	const showSortLink: boolean = sort !== undefined && rows!.length > 1

	// Use URLSearchParams object to build sort link per head cell
	const sortLink = useMemo(() => {
		if(!showSortLink) return undefined

		if(sort === undefined) {
			return undefined
		}

		const localParams = new URLSearchParams(params)
		localParams.set("sort", sort)
		localParams.set("direction", nextDirection)

		return `${pathname}?${localParams.toString()}`
	}, [showSortLink, params, sort, nextDirection, pathname])

	return (
		<Table.Th
			ref={ thRef }
			className={ clsx(
				{ "table-column-fit": fitContent },
				{ "sortable": showSortLink },
				{ [currentDirection ?? "asc"]: showSortLink && paramsSort === sort },
			) }
			style={ {
				whiteSpace: nowrap ? "nowrap" : "normal",
				...style,
			} }
			{ ...props }
		>
			<Flex align="center">
				{ showSortLink && sortLink ?
					<Link
						href={ sortLink }
						preserveScroll={ true }
					>
						{ children }
					</Link>
					:
					children
				}
			</Flex>
		</Table.Th>
	)
}
