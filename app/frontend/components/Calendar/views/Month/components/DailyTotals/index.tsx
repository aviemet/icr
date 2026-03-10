import clsx from "clsx"

import { Box, Group } from "@/components"

import * as classes from "./DailyTotals.css"

export interface DailyTotalsProps {
	dailyMinutesTotal: number
}

export function DailyTotals({ dailyMinutesTotal }: DailyTotalsProps) {
	return (
		<Box className={ clsx((classes.dailyTotals)) }>
			<Group justify="space-between">
				<Box>Total Hours</Box>
				<Box>{ Math.round(dailyMinutesTotal / 60) }</Box>
			</Group>
		</Box>
	)
}
