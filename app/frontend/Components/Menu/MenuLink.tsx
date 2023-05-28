import React, { forwardRef } from 'react'
import { Menu, createPolymorphicComponent, type MenuItemProps } from '@mantine/core'
import cx from 'clsx'
import { Link } from '@/Components'
import { ILinkProps } from '../Link'
import useMenuItemStyles from './useMenuItemStyles'

interface IMenuItemProps extends MenuItemProps, Omit<ILinkProps, 'color'|'children'> {
	disabled?: boolean
	type?: string
}

const MenuItem = forwardRef<HTMLAnchorElement, IMenuItemProps>((
	{ children, disabled = false, className, ...props },
	ref,
) => {
	const { classes } = useMenuItemStyles()

	return (
		<Menu.Item
			ref={ ref }
			disabled={ disabled }
			component={ Link }
			className={ cx(classes.menuItem, className, { disabled }) }
			{ ...props }
		>
			{ children }
		</Menu.Item>
	)
})

export default createPolymorphicComponent<typeof Link, IMenuItemProps>(MenuItem)
