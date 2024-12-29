import { NavLink, NavLinkProps } from '@/Components'
import { ActionIcon, Box, Group, Tooltip } from '@/Components'

import cx from 'clsx'
import * as classes from '../AppLayout.css'
import useStore from '@/lib/store'

interface MenuLinkProps extends NavLinkProps {}

const MenuLink = ({ children, className, active, mb = 'sm', ...props }: MenuLinkProps) => {
	const { sidebarOpen } = useStore()

	return (
		<NavLink
			className={ cx(classes.navLink, { active }) }
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
				<Box className={ cx('hidden-when-closed') }>{ children }</Box>
			</Group> */ }
		</NavLink>
	)
}

export default MenuLink
