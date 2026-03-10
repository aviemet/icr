import { ActionIcon, Menu, type MenuTargetProps } from "@mantine/core"
import React from "react"

import { DotsIcon } from "@/components/Icons"

interface IMenuTargetProps extends Omit<MenuTargetProps, "children"> {
	ref?: React.Ref<HTMLDivElement>
	children?: React.ReactNode
	icon?: React.ReactNode
	variant?: "gradient" | "subtle" | "filled" | "outline" | "light" | "default" | "transparent"
	color?: string
}

export function MenuTarget({ children, icon, variant, color, ref, ...props }: IMenuTargetProps) {
	if(!children) {
		return (
			<Menu.Target ref={ ref } { ...props }>
				<ActionIcon color={ color } variant={ variant } >
					{ icon || <DotsIcon /> }
				</ActionIcon>
			</Menu.Target>
		)
	}

	return (
		<Menu.Target { ...props }>
			{ children }
		</Menu.Target>
	)
}
