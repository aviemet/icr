import { Link } from "@inertiajs/react"
import clsx from "clsx"
import { Children, ReactNode } from "react"

import { Box } from "@/components"
import { NextIcon } from "@/components/Icons"

import * as classes from "../AppLayout.css"

export interface MenuLinkProps {
	href: string
	label: string
	leftSection?: ReactNode
	active?: boolean
	children?: ReactNode
}

function hasVisibleChildren(children: ReactNode) {
	return Children.toArray(children).some(Boolean)
}

export function MenuLink({
	href,
	label,
	leftSection,
	active,
	children,
}: MenuLinkProps) {
	const showSubmenu = hasVisibleChildren(children)

	return (
		<li>
			<Link
				href={ href }
				className={ clsx(classes.navLink, "nav-link", { active }) }
			>
				<Box className="content">
					{ leftSection }
					<Box component="span" className="label">{ label }</Box>
				</Box>
				{ showSubmenu && <NextIcon className="indicator" /> }
			</Link>
			{ showSubmenu && (
				<ul className={ clsx(classes.submenu, "submenu") }>
					{ children }
				</ul>
			) }
		</li>
	)
}
