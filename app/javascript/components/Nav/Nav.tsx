import React from 'react'
import classnames from 'classnames'

interface Nav {
	children: React.ReactNode
	leftSide: boolean
	className: string
}

const Nav = ({ children, leftSide = false, className }) => {
	return (
		<ul
			className={ classnames(
				`flex lg:items-center flex-col lg:flex-row list-none ${leftSide ? 'mr-auto' : 'ml-auto'}`,
				className
			) }
		>
			{ children }
		</ul>
	)
}

export default Nav
