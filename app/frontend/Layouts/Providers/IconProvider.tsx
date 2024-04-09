import React from 'react'
import { IconContext } from 'react-icons'

interface IconProviderProps {
	children: React.ReactNode
	value?: { className?: string, size?: string }
}

const IconProvider = ({ children, value = {
	className: 'react-icon',
	size: '1rem',
} }: IconProviderProps) => {
	return (
		<IconContext.Provider value={ value }>
			{ children }
		</IconContext.Provider>
	)
}

export default IconProvider
