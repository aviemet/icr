import { NavLink, type NavLinkProps } from '@mantine/core'
import { Link, type InertiaLinkProps } from '@inertiajs/react'
import { useLocation } from '@/lib/hooks'

interface NavLinkComponentProps
	extends NavLinkProps,
	Omit<InertiaLinkProps, 'color' | 'size' | 'span' | 'label' | 'onChange' | 'onClick' | 'onKeyDown' | 'style' | 'active'> {}
export { type NavLinkComponentProps as NavLinkProps }

const NavLinkComponent = (props: NavLinkComponentProps) => {
	const { pathname } = useLocation()

	return (
		<NavLink component={ Link } active={ pathname === props.href } { ...props } />
	)
}

export default NavLinkComponent
