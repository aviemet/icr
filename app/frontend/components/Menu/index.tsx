import { Menu as MantineMenu, type MenuProps } from "@mantine/core"

import { MenuItem } from "./MenuItem"
import { MenuLink } from "./MenuLink"
import { MenuTarget } from "./MenuTarget"

export function Menu({ children, ...props }: MenuProps) {
	return (
		<MantineMenu { ...props }>{ children }</MantineMenu>
	)
}

Menu.Target = MenuTarget
Menu.Dropdown = MantineMenu.Dropdown
Menu.Label = MantineMenu.Label
Menu.Item = MenuItem
Menu.Link = MenuLink
Menu.Divider = MantineMenu.Divider
