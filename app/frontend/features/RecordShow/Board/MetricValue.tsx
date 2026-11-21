import clsx from "clsx"

import { Link, Text } from "@/components"

import * as board from "../BoardPrimitives.css"

export interface MetricValueProps {
	children: React.ReactNode
	label?: React.ReactNode
	href?: string
}

export function MetricValue({ children, label, href }: MetricValueProps) {
	const content = (
		<>
			<div className={ board.metricValue }>
				{ children }
			</div>
			{ label !== null && label !== undefined && (
				<Text size="sm" c="dimmed" className={ board.metricValueLabel }>
					{ label }
				</Text>
			) }
		</>
	)

	if(href) {
		return (
			<Link href={ href } className={ clsx(board.metricValueRow, board.metricLink) }>
				{ content }
			</Link>
		)
	}

	return (
		<div className={ board.metricValueRow }>
			{ content }
		</div>
	)
}
