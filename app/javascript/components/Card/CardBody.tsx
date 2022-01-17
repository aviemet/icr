import React from 'react'
import { DivProps } from 'react-html-props'
import classnames from 'classnames'

const CardBody = ({ children, className, ...rest }: DivProps) => {
	return <div className={ classnames('p-4', className) } { ...rest }>{ children }</div>
}

export default CardBody
