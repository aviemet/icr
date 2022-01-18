import React from 'react'

const TooltipContent = ({ children, className }) => {
	return (
		<div
			className={ `px-2.5 py-1.5 bg-black bg-opacity-80 text-white text-sm rounded ${className}` }
		>
			{ children }
		</div>
	)
}

export default TooltipContent