import React from 'react'

export default function TabContent({ children }) {
	return (
		<div className="relative flex flex-col w-full min-w-0 px-4 pb-4 break-words">
			<div className="flex-auto font-light leading-normal text-center">
				{children}
			</div>
		</div>
	)
}

TabContent.propTypes = {
	children: PropTypes.node.isRequired,
}
