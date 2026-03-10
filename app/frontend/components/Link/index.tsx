import { type Method, type Visit } from "@inertiajs/core"
import { type AnchorProps, type ButtonProps } from "@mantine/core"
import React, { useMemo } from "react"

import { ExternalLink } from "./ExternalLink"
import { InertiaLink } from "./InertiaLink"

export { NavLink, type NavLinkProps } from "./NavLink"

export interface LinkProps
	extends
	Omit<AnchorProps, "onProgress"> {
	ref?: React.Ref<HTMLAnchorElement>
	children?: React.ReactNode
	href: string
	method?: Method
	visit?: Omit<Visit, "method">
	external?: boolean
	as?: "a" | "button"
	onProgress?: React.ReactEventHandler<Element>
	onClick?: React.ReactEventHandler<Element>
	target?: string
	rel?: string
	tabIndex?: number
	disabled?: boolean
	buttonProps?: ButtonProps
	preserveScroll?: boolean
	leftSection?: React.ReactNode
}

const externalPrefix = ["http", "www"]

export function Link({
	children,
	href,
	as = "a",
	method,
	visit,
	external,
	onProgress,
	onClick,
	preserveScroll,
	disabled = false,
	ref,
	...props
}: LinkProps) {
	// Disable navigation if link is disabled
	const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
		if(disabled) {
			e.preventDefault()
			onClick?.(e)
			return false
		}

		return onClick?.(e)
	}

	const renderExternal = useMemo(() => {
		if(external !== undefined) return external

		let localExternal = false
		externalPrefix.some(prefix => {
			if(href?.startsWith(prefix)) {
				const url = new URL(href.startsWith("http") ? href : `http://${href}`)
				localExternal = url.hostname !== window.location.hostname
			}
		})

		return localExternal
	}, [href, external])

	if(renderExternal) {
		return (
			<ExternalLink
				href={ href }
				ref={ ref }
				onClick={ handleClick }
				disabled={ disabled }
				{ ...onProgress }
				{ ...props }
			>
				{ children }
			</ExternalLink>
		)
	}

	return (
		<InertiaLink
			href={ href }
			as={ as }
			method={ method }
			visit={ visit }
			ref={ ref }
			onClick={ handleClick }
			preserveScroll={ preserveScroll }
			disabled={ disabled }
			{ ...onProgress }
			{ ...props }
		>
			{ children }
		</InertiaLink>
	)
}
