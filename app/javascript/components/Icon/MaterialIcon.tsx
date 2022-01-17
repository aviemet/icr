import React from 'react'
import { DivProps } from 'react-html-props'
import classnames from 'classnames'

interface FontAwesomeIcon extends DivProps {
	name: string
	className: string
}

const MaterialIcon = ({ name, className, ...rest }: FontAwesomeIcon) => {
	return (

		<span
			{ ...rest }
			className={ classnames('material-icons leading-none', className) }
		>
			{ name }
		</span>
	)
}

export default MaterialIcon
