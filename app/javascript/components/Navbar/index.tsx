import React from 'react'
import classnames from 'classnames'

interface NavbarProps {
	children: React.ReactNode,
	navbar?: boolean,
	color?: string,
	className?: string,
	id?: string
}

const Navbar = ({ children, navbar = false, color, className, id }: NavbarProps) => {
	return (
		<>
			<nav id={ id } className={ classnames('flex', 'flex-wrap', 'items-center', 'justify-between', 'py-2.5', 'px-3', 'mb-3', { 'rounded-lg': !navbar }, `bg-${color || 'primary-400'}`, className) }>
				{children}
			</nav>
		</>
	)
}

export default Navbar
