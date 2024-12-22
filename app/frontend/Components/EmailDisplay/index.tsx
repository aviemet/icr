import React from 'react'

interface EmailDisplayProps {
	children: string
}

const EmailDisplay = ({ children }: EmailDisplayProps) => {
	return (
		<>{ children }</>
	)
}

export default EmailDisplay
