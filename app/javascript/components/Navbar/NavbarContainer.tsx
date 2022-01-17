import React from 'react'

export default function NavbarContainer({ children, className }) {
	return (
		<div
			className={ `container max-w-7xl px-4 mx-auto flex flex-wrap items-center justify-between ${className}` }
		>
			{children}
		</div>
	)
}

NavbarContainer.propTypes = {
	children: PropTypes.node.isRequired,
}
