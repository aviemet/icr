import React from 'react'
import Ripple from 'lib/material-ripple-effects'

export default function NavLink({ children, active, ripple, ...props }) {
	const rippleEffect = new Ripple()

	return (
		<a
			{ ...props }
			className={ `${active === 'dark' && 'bg-black bg-opacity-20'} ${
				active === 'light' && 'bg-white bg-opacity-20'
			} px-5 py-4 flex gap-1 items-center text-xs uppercase font-medium leading text-white rounded-lg` }
			onMouseUp={ (e) => {
				ripple === 'dark' && rippleEffect.create(e, 'dark')
				ripple === 'light' && rippleEffect.create(e, 'light')
			} }
		>
			{children}
		</a>
	)
}

NavLink.propTypes = {
	children: PropTypes.node.isRequired,
	active: PropTypes.string,
	ripple: PropTypes.string,
}
