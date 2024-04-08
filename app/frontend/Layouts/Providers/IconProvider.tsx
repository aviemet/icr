import { withDefaults } from '@/lib'
import React from 'react'
import { IconContext, type IconContext as IconContextProps } from 'react-icons'

const defaultClassName = 'react-icon'
const defaultSize = '1rem'

interface IIconProviderProps extends IconContextProps {
	children: React.ReactNode
}

const IconProvider = ({ children, ...props }: IIconProviderProps) => {
	const value: IconContextProps = withDefaults(props, {
		className: defaultClassName,
		size: defaultSize,
	})
	return (
		<IconContext.Provider value={ value }>
			{ children }
		</IconContext.Provider>
	)
}

export default IconProvider
