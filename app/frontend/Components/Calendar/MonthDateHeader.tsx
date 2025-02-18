import React from "react"
import { type DateHeaderProps } from "react-big-calendar"
import { Box } from "@/Components"
import NewShiftButton, { NewShiftClick } from "./NewShiftButton"

export interface MonthDateHeaderProps extends DateHeaderProps {
	onNewShift?: NewShiftClick | undefined
}

const MonthDateHeader = ({
	date,
	drilldownView,
	isOffRange,
	label,
	onDrillDown,
	onNewShift,
}: MonthDateHeaderProps) => {
	// const dayOfWeek = date.getDay()

	return <>
		<Box component="span">
			{ onNewShift && <NewShiftButton date={ date } onClick={ onNewShift }/> }
			{ label }
		</Box>
	</>
}

export default React.memo(MonthDateHeader)
