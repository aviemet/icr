import React from 'react'
import Link, { LinkProps } from 'components/Link'
import classnames from 'classnames'

interface NavLinkProps extends LinkProps {
	active?: boolean
}

const NavLink = ({ children, className, active = false, ...props }: NavLinkProps) => {
	const activeClasses = 'bg-gradient-to-tr from-light-blue-500 to-light-blue-700 text-white shadow-md'
	const inactiveClasses = 'flex items-center gap-4 px-4 py-3 text-sm font-light text-gray-700 rounded-lg'
	const classes = active ? activeClasses : inactiveClasses

	return (
		<Link { ...props } className={ classnames(classes, className) }>{ children }</Link>
	)
}

export default NavLink
