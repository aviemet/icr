import React from 'react'

import { colors } from 'layouts/theme'

export default function Navbar({ children, color, navbar, className }) {
	return (
		<>
			<nav
				className={ `flex flex-wrap items-center justify-between py-2.5 px-3 mb-3 ${
					colors[color]
				} ${!navbar && 'rounded-lg'} ${className}` }
			>
				{children}
			</nav>
		</>
	)
}

Navbar.defaultProps = {
	color: 'lightBlue',
	navbar: false,
}

Navbar.propTypes = {
	children: PropTypes.node.isRequired,
	color: PropTypes.string.isRequired,
	navbar: PropTypes.bool,
}
