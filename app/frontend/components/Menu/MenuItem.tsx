import { Menu, createPolymorphicComponent, type MenuItemProps, Flex } from "@mantine/core"
import clsx from "clsx"
import React from "react"

import { Link } from ".."
import * as classes from "./MenuItem.css"

interface IMenuItemProps extends MenuItemProps {
	ref?: React.Ref<HTMLButtonElement>
	disabled?: boolean
	href?: string
	icon?: JSX.Element
}

const MenuItem = ({
	children,
	disabled = false,
	href,
	icon,
	className,
	ref,
	...props
}: IMenuItemProps) => {
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
}

export default createPolymorphicComponent<"button", IMenuItemProps>(MenuItem)
