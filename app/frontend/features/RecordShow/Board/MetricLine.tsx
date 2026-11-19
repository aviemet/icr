import { Box } from "@/components"

import * as board from "../BoardPrimitives.css"

export interface MetricLineProps {
	label: string
	value: React.ReactNode
}

export function MetricLine({ label, value }: MetricLineProps) {
	return (
		<Box className={ board.metricLine }>
			<span className={ board.metricLabel }>{ label }</span>
			<span>{ value }</span>
		</Box>
	)
}
