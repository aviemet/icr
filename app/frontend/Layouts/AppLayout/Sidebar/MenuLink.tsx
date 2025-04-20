import { Link } from "@inertiajs/react"
import clsx from "clsx"
import { ReactNode } from "react"

import { NextIcon } from "@/Components/Icons"

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
				<div className="content">
					{ leftSection }
					{ label }
				</div>
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
