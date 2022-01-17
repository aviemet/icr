import React from 'react'

export default function Pagination({ children }) {
	return (
		<div className="py-2">
			<div className="block">
				<ul className="flex pl-0 list-none rounded">{children}</ul>
			</div>
		</div>
	)
}

Pagination.propTypes = {
	children: PropTypes.node.isRequired,
}
