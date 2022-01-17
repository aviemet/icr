import React from 'react'
import { DivProps } from 'react-html-props'
import classnames from 'classnames'

const CardRow = ({ children, className, ...rest }: DivProps) => {
	return (
		<div className={ classnames('flex flex-wrap border-b border-gray-200', className) } { ...rest }>
			{ children }
		</div>
	)
}

export default CardRow
