import { Link, type InertiaLinkProps } from "@inertiajs/react"
import { NavLink as MantineNavLink, type NavLinkProps } from "@mantine/core"

import { useLocation } from "@/lib/hooks"

interface NavLinkComponentProps
	extends NavLinkProps,
	Omit<InertiaLinkProps, "color" | "size" | "span" | "label" | "onChange" | "onClick" | "onKeyDown" | "style" | "active"> {}
export { type NavLinkComponentProps as NavLinkProps }

export function NavLink({ ...props }: NavLinkComponentProps) {
	const { pathname } = useLocation()

	return (
		<MantineNavLink component={ Link } active={ pathname === props.href } autoContrast { ...props } />
	)
}
