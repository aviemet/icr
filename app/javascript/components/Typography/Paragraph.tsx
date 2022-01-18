import React from 'react'
import { colorClass, Tcolors } from 'layouts/theme'
import { PProps } from 'react-html-props'
import classnames from 'classnames'

interface ParagraphProps extends PProps {
	color?: Tcolors
}

const Paragraph = ({ children, color = 'blueGray', ...props }: ParagraphProps) => {
	const colors = colorClass('text-gray', color, 700)

	return (
		<p
			{ ...props }
			className={ classnames(colors, 'text-base font-light leading-relaxed mt-0 mb-4') }
		>
			{ children }
		</p>
	)
}

export default Paragraph
