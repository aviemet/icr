import React from 'react'
import classnames from 'classnames'

interface NavbarProps {
	children: React.ReactNode,
	navbar?: boolean,
	color?: string,
	fixed?: boolean,
	className?: string,
	id?: string
}

const Navbar = ({ children, navbar = false, color, fixed = false, className, id }: NavbarProps) => {
	const classes = ['flex', 'flex-wrap', 'items-center', 'justify-between', 'py-2.5', 'px-3', 'mb-3']
	if(fixed) {
		classes.push('fixed', 'top-0', 'w-full')
	}

	return (
		<>
			{ /* purgecss: bg-base */}
			<nav id={ id } className={ classnames( ...classes, { 'rounded-lg': !navbar }, `bg-${color || 'base'}`, className) }>
				{children}
			</nav>
		</>
	)
}

export default Navbar
