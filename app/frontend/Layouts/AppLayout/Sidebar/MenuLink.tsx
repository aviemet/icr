import clsx from "clsx"

import { NavLink, NavLinkProps , ActionIcon, Box, Group, Tooltip } from "@/Components"
import useStore from "@/lib/store"

import * as classes from "../AppLayout.css"


interface MenuLinkProps extends NavLinkProps {}

const MenuLink = ({ children, className, active, mb = "sm", ...props }: MenuLinkProps) => {
	const { sidebarOpen } = useStore()

	return (
		<NavLink
			className={ clsx(classes.navLink, { active }) }
			mb={ mb }
			active={ active }
			{ ...props }
		>
			{ children }
			{ /* <Group gap={ 0 }>
				<Tooltip
					label={ children }
					disabled={ sidebarOpen }
					position="right"
					withArrow
				>
					<ActionIcon
						c="bright"
						size={ sidebarOpen ? 'lg' : 'md' }
						variant="transparent"
						aria-label={ children }
					>
						{ icon  }
					</ActionIcon>
				</Tooltip>
				<Box className={ clsx('hidden-when-closed') }>{ children }</Box>
			</Group> */ }
		</NavLink>
	)
}

export default MenuLink
