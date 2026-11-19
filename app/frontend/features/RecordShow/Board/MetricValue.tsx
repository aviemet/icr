import * as board from "../BoardPrimitives.css"

export interface MetricValueProps {
	children: React.ReactNode
}

export function MetricValue({ children }: MetricValueProps) {
	return (
		<div className={ board.metricValue }>
			{ children }
		</div>
	)
}
