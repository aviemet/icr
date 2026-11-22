import clsx from "clsx"
import React from "react"

import { Link } from "@/components"
import { type LinkProps } from "@/components/Link"

export interface SettingsNavLinkProps extends LinkProps {
	ref?: React.Ref<HTMLAnchorElement>
	icon?: React.ReactNode
}

export function SettingsNavLink({
	children,
	icon,
	underline = "never",
	ref,
	...props
}: SettingsNavLinkProps) {
	return <Link
		ref={ ref }
		underline={ underline }
		{ ...props }
	>
		<span className={ clsx("controlLabel") }>
			{ icon && <span className="controlIcon" aria-hidden="true">{ icon }</span> }
			{ children }
		</span>
	</Link>
}
