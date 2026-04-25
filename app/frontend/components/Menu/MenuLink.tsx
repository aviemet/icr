import { Menu, createPolymorphicComponent, type MenuItemProps as MantineMenuItemProps } from "@mantine/core"
import clsx from "clsx"
import React from "react"

import { Link } from "@/components"

import { LinkProps } from "../Link"

interface MenuItemProps extends MantineMenuItemProps, Omit<LinkProps, "color" | "children" | "classNames" | "styles" | "variant" | "vars"> {
	ref?: React.Ref<HTMLAnchorElement>
	disabled?: boolean
	type?: string
}

const MenuLinkInner = ({
	children,
	disabled = false,
	className,
	ref,
	...props
}: MenuItemProps) => {
	return (
		<Menu.Item
			ref={ ref }
			disabled={ disabled }
			component={ Link }
			className={ clsx(className, { disabled }) }
			underline="never"
			{ ...props }
		>
			{ children }
		</Menu.Item>
	)
}

const MenuLink = createPolymorphicComponent<typeof Link, MenuItemProps>(MenuLinkInner)

export { MenuLink }
