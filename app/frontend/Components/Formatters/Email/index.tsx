import { Anchor, ConditionalWrapper } from "@/Components"

interface EmailDisplayProps {
	children: string
	link?: boolean
}

const EmailDisplay = ({ children, link = true }: EmailDisplayProps) => {
	return (
		<ConditionalWrapper
			condition={ link }
			wrapper={ content => <Anchor href={ `mailto:${children}` }>{ content }</Anchor> }
		>
			<address>{ children }</address>
		</ConditionalWrapper>
	)
}

export default EmailDisplay
