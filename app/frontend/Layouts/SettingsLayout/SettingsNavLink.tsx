import { Link } from "@/Components"
import { type LinkProps } from "@/Components/Link"
import { useLocation } from "@/lib/hooks"
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
	const { pathname } = useLocation()
	const isActive = pathname.includes(props.href)

	return <Link
		ref={ ref }
		underline={ underline }
		// active={ isActive }
		{ ...props }
	>
		<span className={ cx("controlLabel") }>{ children }</span>
	</Link>
})

export default SettingsNavLink
