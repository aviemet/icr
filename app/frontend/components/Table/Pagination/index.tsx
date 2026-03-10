import {
	Group,
	Pagination as MantinePagination,
	type PaginationProps as MantinePaginationProps,
} from "@mantine/core"
import clsx from "clsx"

import { Link } from "@/components"

import { useTableContext } from "../TableContext"
import { LimitSelect } from "./LimitSelect"
import * as classes from "../Table.css"

const pageLink = (page: number) => {
	const url = new URL(window.location.href)

	if(page === 1) {
		url.searchParams.delete("page")
	} else {
		url.searchParams.set("page", String(page))
	}

	return `${url.pathname}${url.search}`
}

interface PaginationProps extends Omit<MantinePaginationProps, "total"> {}

export function Pagination({
	boundaries = 2,
	siblings = 2,
	className,
	...props
}: PaginationProps) {
	const { tableState: { pagination, model } } = useTableContext()

	if(!pagination) return <></>

	const { count, pages, limit, current_page, next_page, prev_page /* is_first_page, is_last_page */ } = pagination
	const recordStart = ((current_page - 1) * limit) + 1
	const recordEnd = Math.min(current_page * limit, count)

	return (
		<Group justify="space-between" mt="auto" pt={ 8 }>
			<div>
				{ model && <>
					Records per page:
					<LimitSelect
						className={ clsx(classes.limitSelect) }
						pagination={ pagination }
						model={ model }
					/>
				</> }
				Showing <b> { recordStart } - { recordEnd } / { count } </b>
			</div>

			<MantinePagination.Root
				className={ clsx(className, classes.pagination) }
				total={ pages }
				getItemProps={ (page) => ({
					component: Link,
					href: pageLink(page),
				}) }
				defaultValue={ current_page }
				{ ...props }
			>
				<Group gap={ 7 } justify="center"
					style={ { "a:hover": {
						textDecoration: "none",
					} } }>
					<MantinePagination.First
						component={ Link }
						href={ pageLink(1) }
						disabled={ current_page === 1 }
					/>

					<MantinePagination.Previous
						component={ Link }
						href={ pageLink(prev_page) }
						disabled={ prev_page === null }
					/>

					<MantinePagination.Items />

					<MantinePagination.Next
						component={ Link }
						href={ pageLink(next_page) }
						disabled={ next_page === null }
					/>

					<MantinePagination.Last
						component={ Link }
						href={ pageLink(pages) }
						disabled={ current_page === pages }
					/>

				</Group>
			</MantinePagination.Root>
		</Group>
	)
}
