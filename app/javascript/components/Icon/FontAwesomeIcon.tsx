import React from 'react'
import classnames from 'classnames'
import { DivProps } from 'react-html-props'

interface FontAwesomeIcon extends DivProps {
	name: string
	className: string
}

const FontAwesomeIcon = ({ name, className, ...rest }) => {
	return (
		<i
			{ ...rest }
			className={ classnames(name, className) }
		/>
	)
}

export default FontAwesomeIcon
