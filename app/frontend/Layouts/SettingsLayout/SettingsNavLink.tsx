import { Link } from "@/Components"
import { type LinkProps } from "@/Components/Link"
import { forwardRef } from "react"

import cx from "clsx"

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
		<span className={ cx("controlLabel") }>{ children }</span>
	</Link>
})

export default SettingsNavLink
