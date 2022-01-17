import React from 'react'
import { DivProps } from 'react-html-props'

const CardFooter = ({ children, className, ...rest }: DivProps) => {
	return <div className={ `p-4 ${className}` } { ...rest }>{children}</div>
}

export default CardFooter
