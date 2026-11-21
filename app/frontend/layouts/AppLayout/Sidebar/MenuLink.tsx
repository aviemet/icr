import { Link } from "@inertiajs/react"
import clsx from "clsx"
import { Children, ReactNode } from "react"

import { Box } from "@/components"
import { DownArrowIcon, NextIcon } from "@/components/Icons"
import { useStore } from "@/lib/store"

import * as classes from "../AppLayout.css"

export interface MenuLinkProps {
	href: string
	label: string
	leftSection?: ReactNode
	active?: boolean
	menuKey?: string
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
	menuKey,
	children,
}: MenuLinkProps) {
	const { sidebarOpen, collapsedMenus, toggleMenuCollapsed } = useStore()
	const showSubmenu = hasVisibleChildren(children)
	const menuCollapsed = Boolean(menuKey && collapsedMenus[menuKey])
	const renderSubmenu = showSubmenu && (!sidebarOpen || !menuCollapsed)

	return (
		<li>
			<div className={ clsx(classes.navLink, "nav-link", { active }) }>
				<Link href={ href } className="nav-link-anchor">
					<Box className="content">
						{ leftSection }
						<Box component="span" className="label">{ label }</Box>
					</Box>
				</Link>
				{ showSubmenu && sidebarOpen && (
					menuKey
						? (
							<button
								type="button"
								className={ clsx("indicator", "collapse-toggle", { collapsed: menuCollapsed }) }
								aria-expanded={ !menuCollapsed }
								aria-label={ menuCollapsed ? `Expand ${label}` : `Collapse ${label}` }
								onClick={ () => toggleMenuCollapsed(menuKey) }
							>
								<DownArrowIcon />
							</button>
						)
						: (
							<NextIcon className="indicator" />
						)
				) }
			</div>
			{ renderSubmenu && (
				<ul className={ clsx(classes.submenu, "submenu") }>
					{ children }
				</ul>
			) }
		</li>
	)
}
