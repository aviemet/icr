import React from 'react'
import { colorClass, Tcolors } from 'layouts/theme'
import { H4Props } from 'react-html-props'
import classnames from 'classnames'

interface ThisH4Props extends H4Props {
	color?: Tcolors
}

const H4 = ({ children, color = 'gray', ...props }: ThisH4Props) => {
	const colors = colorClass('text', color, { default: 500, yellow: 600 })

	return (
		<h4
			{ ...props }
			className={ classnames(colors, 'text-3xl font-serif font-bold leading-normal mt-0 mb-2') }
		>
			{ children }
		</h4>
	)
}

export default H4
