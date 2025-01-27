import React, { forwardRef } from "react"
import { Menu, createPolymorphicComponent, type MenuItemProps as MantineMenuItemProps } from "@mantine/core"
import cx from "clsx"
import { Link } from "@/Components"
import { LinkProps } from "../Link"

interface MenuItemProps extends MantineMenuItemProps, Omit<LinkProps, "color" | "children" | "classNames" | "styles" | "variant" | "vars"> {
	disabled?: boolean
	type?: string
}

const MenuItem = forwardRef<HTMLAnchorElement, MenuItemProps>((
	{ children, disabled = false, className, ...props },
	ref,
) => {
	return (
		<Menu.Item
			ref={ ref }
			disabled={ disabled }
			component={ Link }
			className={ cx(className, { disabled }) }
			underline="never"
			{ ...props }
		>
			{ children }
		</Menu.Item>
	)
})

export default createPolymorphicComponent<typeof Link, MenuItemProps>(MenuItem)
