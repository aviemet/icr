import { Method, Visit } from "@inertiajs/core"
import { router } from "@inertiajs/react"
import { type ButtonProps } from "@mantine/core"
import React from "react"

import { Button } from "@/components"
import { AnchorLink, type AnchorLinkProps } from "@/components/Link/AnchorLink"
import { exclude } from "@/lib/collections"

interface InertiaLinkProps extends AnchorLinkProps {
	ref?: React.Ref<HTMLAnchorElement>
	children?: React.ReactNode
	href: string
	as: "a" | "button"
	method?: Method
	visit?: Omit<Visit, "method">
	buttonProps?: ButtonProps
	disabled?: boolean
	onClick?: React.MouseEventHandler<Element>
}

export function InertiaLink({
	children,
	href,
	as = "a",
	method,
	visit,
	buttonProps,
	style,
	disabled,
	onClick,
	ref,
	...props
}: InertiaLinkProps) {
	const handleHTTP = (event: React.MouseEvent<Element, MouseEvent>) => {
		onClick?.(event)
		if(event.defaultPrevented) return

		event.preventDefault()
		router.visit(href, {
			method,
			...visit,
		})
	}

	const mergedButtonProps = Object.assign(
		{ disabled },
		buttonProps,
		exclude(props, ["classNames", "style", "vars"]),
	)

	const processedHref = disabled ? "#" : href

	if((method !== undefined && method !== "get")) {
		return <Button
			ref={ ref }
			href={ processedHref }
			onClick={ handleHTTP }
			style={ [{ "&:hover": { textDecoration: "none" } }, style] }
			c="bright"
			{ ...mergedButtonProps }
			component={ AnchorLink }
		>
			{ children }
		</Button>
	}

	if(as === "button") {
		return <Button
			ref={ ref }
			href={ processedHref }
			onClick={ onClick }
			style={ [{ "&:hover": { textDecoration: "none" } }, style] }
			c="bright"
			{ ...mergedButtonProps }
			component={ AnchorLink }
		>
			{ children }
		</Button>
	}

	return (
		<AnchorLink
			href={ processedHref }
			ref={ ref }
			onClick={ onClick }
			{ ...props }
		>
			{ children }
		</AnchorLink>
	)
}
