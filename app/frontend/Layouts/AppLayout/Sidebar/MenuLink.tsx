import React from 'react'
import { Link } from '@/Components'
import { ActionIcon, Box, Group, Tooltip } from '@/Components'
import { AnchorProps } from '@mantine/core'

import cx from 'clsx'
import * as classes from '../AppLayout.css'
import { useLayoutStore } from '@/lib/store'

interface MenuLinkProps extends AnchorProps {
	children: string
	href: string
	icon?: JSX.Element
	active?: boolean
}

const MenuLink = ({ children, href, icon, className, active, ...props }: MenuLinkProps) => {
	const { sidebarOpen } = useLayoutStore()

	return (
		<Link href={ href } className={ cx(classes.navLink, { active }) } mb="sm" { ...props }>
			<Group gap={ 0 }>
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
			</Group>
		</Link>
	)
}

export default MenuLink
