import React from 'react'
import Link, { LinkProps } from 'components/Link'
import classnames from 'classnames'

interface NavLinkProps extends LinkProps {
	active?: boolean
}

const NavLink = ({ children, className, href, active, ...props }: NavLinkProps) => {
	if(active === undefined) {
		active = window.location.pathname === href
	}

	const activeClasses = 'bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md'

	return (
		<Link href={ href } className={ classnames('flex items-center gap-4 px-4 py-3 text-sm font-light text-gray-700 rounded-lg', { [activeClasses]: active }, className) } { ...props }>{ children }</Link>
	)
}

export default NavLink
