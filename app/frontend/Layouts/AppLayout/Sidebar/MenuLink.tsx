import React from 'react'
import { Link } from '@/Components'
import { ActionIcon, Box, Group } from '@/Components'
import { AnchorProps } from '@mantine/core'

import cx from 'clsx'
import * as classes from '../AppLayout.css'

interface MenuLinkProps extends AnchorProps {
	children: string
	href: string
	icon?: JSX.Element
	active?: boolean
}

const MenuLink = ({ children, href, icon, className, active, ...props }: MenuLinkProps) => {
	return (
		<Link href={ href } className={ cx(classes.navLink, { active }) } mb="sm" { ...props }>
			<Group gap={ 0 }>
				<ActionIcon
					c="bright"
					size="xl"
					variant="transparent"
					aria-label={ children }
				>
					{ icon  }
				</ActionIcon>
				<Box className={ cx('link-text') }>{ children }</Box>
			</Group>
		</Link>
	)
}

export default MenuLink
