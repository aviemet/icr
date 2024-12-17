import React from 'react'

interface EmailProps {
	children: string
}

const Email = ({ children }: EmailProps) => {
	return (
		<>{ children }</>
	)
}

export default Email
