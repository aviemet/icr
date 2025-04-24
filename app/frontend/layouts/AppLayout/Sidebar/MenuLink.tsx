import { Link } from "@inertiajs/react"
import clsx from "clsx"
import { ReactNode } from "react"

import { Box } from "@/components"
import { NextIcon } from "@/components/Icons"

import * as classes from "../AppLayout.css"

interface MenuLinkProps {
	href: string
	label: string
	leftSection?: ReactNode
	active?: boolean
	children?: ReactNode
}

const MenuLink = ({
	href,
	label,
	leftSection,
	active,
	children,
}: MenuLinkProps) => {
	return (
		<li>
			<Link
				href={ href }
				className={ clsx(classes.navLink, { active }) }
			>
				<Box className="content">
					{ leftSection }
					<Box component="span">{ label }</Box>
				</Box>
				{ children && <NextIcon className="indicator" /> }
			</Link>
			{ children && (
				<ul className={ classes.submenu }>
					{ children }
				</ul>
			) }
		</li>
	)
}

export default MenuLink
