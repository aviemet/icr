import { ActionIcon, Menu, type MenuTargetProps } from "@mantine/core"
import { forwardRef } from "react"

import { DotsIcon } from "@/Components/Icons"

interface IMenuTargetProps extends Omit<MenuTargetProps, "children"> {
	children?: React.ReactNode
	icon?: React.ReactNode
	variant?: "gradient" | "subtle" | "filled" | "outline" | "light" | "default" | "transparent"
	color?: string
}

const MenuTarget = forwardRef(({ children, icon, variant, color, ...props }: IMenuTargetProps, ref: React.ForwardedRef<HTMLDivElement>) => {
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
})

export default MenuTarget
