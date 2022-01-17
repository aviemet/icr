import React from 'react'
import Ripple from 'lib/material-ripple-effects'

import { colors } from 'layouts/theme'

export default function PaginationItem({
	children,
	color,
	button,
	ripple,
	className,
	...rest
}) {
	const rippleEffect = new Ripple()

	return (
		<li className="place-items-center grid">
			<a
				{ ...rest }
				className={ `text-sm leading-none flex ${
					button
						? 'tracking-wider rounded-lg w-14'
						: 'rounded-full w-8'
				} h-8 mx-1 p-0 items-center justify-center ${
					color
						? `${colors[color]} text-white`
						: 'bg-transparent text-gray-700 hover:bg-gray-500 hover:bg-opacity-20 focus:bg-gray-500 focus:bg-opacity-20 active:bg-gray-500 active:bg-opacity-40'
				} transition-all duration-300 ${className}` }
				onMouseUp={ (e) => {
					ripple === 'dark' && rippleEffect.create(e, 'dark')
					ripple === 'light' && rippleEffect.create(e, 'light')
				} }
			>
				{children}
			</a>
		</li>
	)
}

PaginationItem.defaultProps = {
	button: false,
}

PaginationItem.propTypes = {
	children: PropTypes.node.isRequired,
	color: PropTypes.string,
	button: PropTypes.bool.isRequired,
	ripple: PropTypes.string,
}
