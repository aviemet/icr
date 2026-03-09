import { Menu, createPolymorphicComponent, type MenuItemProps, Flex } from "@mantine/core"
import clsx from "clsx"
import React from "react"

import { Link } from ".."
import * as classes from "./MenuItem.css"

interface IMenuItemProps extends MenuItemProps {
	ref?: React.Ref<HTMLButtonElement | HTMLAnchorElement>
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
	const content = (
		<Flex align="center" wrap="nowrap" gap="xs">
			{ icon }
			{ children }
		</Flex>
	)

	if(href !== undefined) {
		return (
			<Menu.Item
				ref={ ref as React.Ref<HTMLAnchorElement> }
				disabled={ disabled }
				className={ clsx(classes.menuItem, className, { disabled }) }
				component={ Link }
				href={ href }
				{ ...props }
			>
				{ content }
			</Menu.Item>
		)
	}

	return (
		<Menu.Item
			ref={ ref as React.Ref<HTMLButtonElement> }
			disabled={ disabled }
			className={ clsx(classes.menuItem, className, { disabled }) }
			component="button"
			{ ...props }
		>
			{ content }
		</Menu.Item>
	)
}

export default createPolymorphicComponent<"button", IMenuItemProps>(MenuItem)
