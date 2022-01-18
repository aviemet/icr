import React from 'react'
import { colors } from 'layouts/theme'

interface ParagraphProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>{
	children?: React.ReactNode
	color?: string
	rest?: any
}

const Paragraph = ({ children, color = 'blueGray', ...props }: ParagraphProps) => {
	return (
		<p
			{ ...props }
			className={ `${colors[color]} text-base font-light leading-relaxed mt-0 mb-4` }
		>
			{ children }
		</p>
	)
}

export default Paragraph
