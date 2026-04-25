import { Group, Pagination as MantinePagination } from "@mantine/core"
import clsx from "clsx"

import { Link } from "@/components"

import { useTableContext } from "../Provider"
import { LimitSelect } from "./LimitSelect"
import * as classes from "./Pagination.css"

interface PaginationProps {
	pagination?: Schema.Pagination
	model?: string
	showLimit?: boolean
}

const pageLink = (page: number) => {
	const url = new URL(window.location.href)
	if(page === 1) {
		url.searchParams.delete("page")
	} else {
		url.searchParams.set("page", String(page))
	}
	return `${url.pathname}${url.search}`
}

export function Pagination({ pagination: paginationProp, model: modelProp, showLimit = true }: PaginationProps) {
	const context = useTableContext(false)
	const pagination = paginationProp ?? context?.pagination
	const model = modelProp ?? context?.model

	if(!pagination) return null

	const { pages, current_page, limit, count } = pagination

	if(!pages || !current_page || !limit) return null

	const recordStart = ((current_page - 1) * limit) + 1
	const recordEnd = Math.min(current_page * limit, count ?? 0)
	const nextPage = current_page < pages ? current_page + 1 : null
	const prevPage = current_page > 1 ? current_page - 1 : null

	return (
		<Group justify="space-between" mt="auto" pt={ 8 }>
			<div>
				{ showLimit && model && (
					<>
						Records per page:
						<LimitSelect
							className={ clsx(classes.limitSelect) }
							pagination={ pagination }
							model={ model }
						/>
					</>
				) }
				{ count !== undefined && (
					<>Showing <b> { recordStart } - { recordEnd } / { count } </b></>
				) }
			</div>

			<MantinePagination
				className={ clsx(classes.pagination) }
				autoContrast
				total={ pages }
				value={ current_page }
				getItemProps={ (page) => ({
					component: Link,
					href: pageLink(page),
				}) }
				getControlProps={ (control: "first" | "last" | "next" | "previous") => {
					if(control === "first") {
						return {
							component: Link,
							href: pageLink(1),
							disabled: current_page === 1,
						}
					}

					if(control === "previous") {
						return {
							component: Link,
							href: prevPage ? pageLink(prevPage) : undefined,
							disabled: prevPage === null,
						}
					}

					if(control === "next") {
						return {
							component: Link,
							href: nextPage ? pageLink(nextPage) : undefined,
							disabled: nextPage === null,
						}
					}

					if(control === "last") {
						return {
							component: Link,
							href: pageLink(pages),
							disabled: current_page === pages,
						}
					}

					return {}
				} }
				boundaries={ 2 }
				siblings={ 2 }
			/>
		</Group>
	)
}
