import React from 'react'

export default function ModalBody({ children }) {
	return <div className="relative flex-auto mb-6">{children}</div>
}

ModalBody.propTypes = {
	children: PropTypes.node.isRequired,
}
