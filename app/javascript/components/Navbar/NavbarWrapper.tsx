import React from 'react'

export default function NavbarWrapper({ children, className }) {
	return (
		<div
			className={ `w-full flex justify-between lg:w-auto lg:static lg:block lg:justify-start ${className}` }
		>
			{children}
		</div>
	)
}

NavbarWrapper.propTypes = {
	children: PropTypes.node.isRequired,
}
