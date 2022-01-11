import React from 'react'
import classnames from 'classnames'

// TODO: Implement 'as' prop
// TODO: Constrain width to media queries
interface ContainerProps {
	children?: React.ReactNode,
	className?: string,
	id?: string
}

const Container = ({ children, className, id }: ContainerProps) => {
	const attrs: { id?: string } = {}
	if(id) attrs.id = id

	return (
		<div { ...attrs } className={ classnames('w-full', 'ml-auto', 'mr-auto', className) }>
			{ children }
		</div>
	)
}

export default Container
