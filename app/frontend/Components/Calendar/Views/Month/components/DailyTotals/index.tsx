import { Box } from "@mantine/core"
import clsx from "clsx"

import * as classes from "./DailyTotals.css"

interface DailyTotalsProps {
	dailyMinutesTotal: number
}

const DailyTotals = ({ dailyMinutesTotal }: DailyTotalsProps) => {
	return (
		<Box className={ clsx((classes.dailyTotals)) }>
			{ dailyMinutesTotal / 60 }
		</Box>
	)
}

export default DailyTotals
