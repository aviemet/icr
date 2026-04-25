import { Box, type BoxProps } from "@mantine/core"

interface IDangerousHtmlProps extends BoxProps {
	children?: string | null
}

export function DangerousHtml({ children, ...props }: IDangerousHtmlProps) {
	return (
		<Box { ...props } dangerouslySetInnerHTML={ { __html: children || "" } } />
	)
}
