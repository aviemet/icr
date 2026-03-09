import { Anchor, type AnchorProps } from "@mantine/core"
import clsx from "clsx"
import normalizeUrl from "normalize-url"
import React from "react"

import { ExternalLinkIcon } from "@/components/Icons"

import * as classes from "./Link.css"

interface IExternalLinkProps
	extends AnchorProps,
	Omit<React.ComponentPropsWithoutRef<"a">, keyof AnchorProps> {
	ref?: React.Ref<HTMLAnchorElement>
	href: string
	as?: "a" | "button"
	disabled?: boolean
}

const ExternalLink = ({
	children,
	href,
	as,
	className,
	disabled = false,
	ref,
	...props
}: IExternalLinkProps) => {
	const url = normalizeUrl(href, { stripWWW: false })

	return (
		<Anchor
			href={ disabled ? "javascript:void(0)" : url }
			target="_blank"
			rel="noreferrer"
			className={ clsx(classes.external, className ) }
			ref={ ref }
			{ ...props }
		>
			{ children }
			<ExternalLinkIcon className="external" />
		</Anchor>
	)
}

export default ExternalLink
