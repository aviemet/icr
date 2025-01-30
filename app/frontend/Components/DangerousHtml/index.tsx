import { Box, type BoxProps } from "@mantine/core"

interface IDangerousHtmlProps extends BoxProps {
	children?: string | null
}

const DangerousHtml = ({ children, ...props }: IDangerousHtmlProps) => {
	return (
		<Box { ...props } dangerouslySetInnerHTML={ { __html: children || "" } } />
	)
}

export default DangerousHtml
