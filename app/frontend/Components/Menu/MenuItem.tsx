import { Menu, createPolymorphicComponent, type MenuItemProps, Flex } from "@mantine/core"
import clsx from "clsx"
import React, { forwardRef } from "react"

import { Link } from ".."
import * as classes from "./MenuItem.css"

interface IMenuItemProps extends MenuItemProps {
	disabled?: boolean
	href?: string
	icon?: JSX.Element
}

const MenuItem = forwardRef<HTMLButtonElement, IMenuItemProps>((
	{ children, disabled = false, href, icon, className, ...props },
	ref,
) => {
	return (
		<Menu.Item
			ref={ ref }
			disabled={ disabled }
			className={ clsx(classes.menuItem, className, { disabled }) }
			component={ href !== undefined ? Link : "button" }
			href={ href }
			{ ...props }
		>
			<Flex align="center" wrap="nowrap" gap="xs">
				{ icon }
				{ children }
			</Flex>
		</Menu.Item>
	)
})

export default createPolymorphicComponent<"button", IMenuItemProps>(MenuItem)
