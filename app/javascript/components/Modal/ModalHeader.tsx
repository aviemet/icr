import React from 'react'

interface ModalHeader {
	children?: React.ReactNode
	toggler: () => void
}

const ModalHeader = ({ children, toggler }) => {
	return (
		<div className="flex items-center justify-between mb-6">
			<h5 className="mt-0 mb-0 text-2xl font-bold text-gray-900">{ children }</h5>
			<button
				className="top-2 right-4 focus:outline-none absolute p-1 text-3xl leading-none text-gray-900 bg-transparent outline-none"
				onClick={ toggler }
			>
				<span className="block text-3xl text-gray-900">&times;</span>
			</button>
		</div>
	)
}

export default ModalHeader
