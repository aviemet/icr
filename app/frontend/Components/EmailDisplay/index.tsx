import React from 'react'
import { ConditionalWrapper, Link } from '@/Components'

interface EmailDisplayProps {
	children: string
	link?: boolean
}

const EmailDisplay = ({ children, link = true }: EmailDisplayProps) => {
	return (
		<ConditionalWrapper
			condition={ link }
			wrapper={ content => <Link href={ `mailto:${children}` }>{ content }</Link> }
		>
			<address>{ children }</address>
		</ConditionalWrapper>
	)
}

export default EmailDisplay
