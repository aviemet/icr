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
	ref,
	...props
}: InertiaLinkProps) {
	const handleHTTP = (e: React.MouseEvent<Element, MouseEvent>) => {
		e.preventDefault()

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
			component={ AnchorLink }
			href={ processedHref }
			onClick={ handleHTTP }
			style={ [{ "&:hover": { textDecoration: "none" } }, style] }
			c="bright"
			{ ...mergedButtonProps }
		>
			{ children }
		</Button>
	}

	if(as === "button") {
		return <Button
			ref={ ref }
			component={ AnchorLink }
			href={ processedHref }
			style={ [{ "&:hover": { textDecoration: "none" } }, style] }
			c="bright"
			{ ...mergedButtonProps }
		>
			{ children }
		</Button>
	}

	return (
		<AnchorLink href={ processedHref } ref={ ref } { ...props }>{ children }</AnchorLink>
	)
}
