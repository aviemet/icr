import React from 'react'
import { Box, type BoxProps } from '@mantine/core'
import cx from 'clsx'
import useSectionStyles from './useSectionStyles'

interface ISectionProps extends BoxProps {
	fullHeight?: boolean
}

const Section = ({ children, fullHeight = false, className, ...props }: ISectionProps) => {
	const { classes } = useSectionStyles()

	return (
		<Box
			component="section"
			className={ cx(classes.section, className, { fullHeight }) }
			{ ...props }
		>
			{ children }
		</Box>
	)
}

export default Section
