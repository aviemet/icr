import { Box, ElementProps, type BoxProps } from "@mantine/core"
import clsx from "clsx"

import * as classes from "./Section.css"

interface ISectionProps extends BoxProps, ElementProps<"section"> {
	fullHeight?: boolean
}

const Section = ({ children, fullHeight = false, className, ...props }: ISectionProps) => {
	return (
		<Box
			component="section"
			className={ clsx(classes, className, { fullHeight }) }
			{ ...props }
		>
			{ children }
		</Box>
	)
}

export default Section
