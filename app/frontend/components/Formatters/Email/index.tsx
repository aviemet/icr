import { Anchor, ConditionalWrapper } from "@/components"

export interface EmailFormatterProps {
	children: string
	link?: boolean
}

export function EmailFormatter({ children, link = true }: EmailFormatterProps) {
	return (
		<ConditionalWrapper
			condition={ link }
			wrapper={ content => <Anchor href={ `mailto:${children}` }>{ content }</Anchor> }
		>
			<address>{ children }</address>
		</ConditionalWrapper>
	)
}
