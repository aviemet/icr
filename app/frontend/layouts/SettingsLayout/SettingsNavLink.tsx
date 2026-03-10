import clsx from "clsx"
import React from "react"

import { Link } from "@/components"
import { type LinkProps } from "@/components/Link"

export interface SettingsNavLinkProps extends LinkProps {
	ref?: React.Ref<HTMLAnchorElement>
}

export function SettingsNavLink({
	children,
	underline = "never",
	ref,
	...props
}: SettingsNavLinkProps) {
	return <Link
		ref={ ref }
		underline={ underline }
		{ ...props }
	>
		<span className={ clsx("controlLabel") }>{ children }</span>
	</Link>
}
