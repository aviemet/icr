import React from 'react'
import { colorClass, Tcolors } from 'layouts/theme'
import { H3Props } from 'react-html-props'
import classnames from 'classnames'

interface ThisH3Props extends H3Props {
	color?: Tcolors
}

const H3 = ({ children, color = 'gray', ...props }: ThisH3Props) => {
	const colors = colorClass('text', color, { default: 500, yellow: 600 })
	return (
		<h3
			{ ...props }
			className={ classnames(colors, 'text-4xl font-serif font-bold leading-normal mt-0 mb-2') }
		>
			{ children }
		</h3>
	)
}

export default H3
