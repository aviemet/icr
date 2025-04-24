import clsx from "clsx"
import { forwardRef } from "react"

import { Link } from "@/components"
import { type LinkProps } from "@/components/Link"


interface SettingsNavLinkProps extends LinkProps {}

const SettingsNavLink = forwardRef<HTMLAnchorElement, SettingsNavLinkProps>((
	{ children,
		underline = "never",
		...props
	},
	ref
) => {
	return <Link
		ref={ ref }
		underline={ underline }
		{ ...props }
	>
		<span className={ clsx("controlLabel") }>{ children }</span>
	</Link>
})

export default SettingsNavLink
