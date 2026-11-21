import clsx from "clsx"

import { Box, Link, Text } from "@/components"

import * as board from "../BoardPrimitives.css"

export interface MetricLineProps {
	label: string
	value: React.ReactNode
	href?: string
}

export function MetricLine({ label, value, href }: MetricLineProps) {
	const content = (
		<>
			<Text>{ label }</Text>
			<Text>{ value }</Text>
		</>
	)

	if(href) {
		return (
			<Link href={ href } className={ clsx(board.metricLine, board.metricLink) }>
				{ content }
			</Link>
		)
	}

	return (
		<Box className={ board.metricLine }>
			{ content }
		</Box>
	)
}
