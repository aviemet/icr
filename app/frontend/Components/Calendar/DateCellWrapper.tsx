import React from "react"
import { Box } from "@/Components"
import { type DateCellWrapperProps } from "react-big-calendar"
// import NewShiftButton from "./NewShiftButton"

const DateCellWrapper = ({ children, range, value }: DateCellWrapperProps) => {

	return (
		<Box className="rbc-date-cell">
			{ children }
		</Box>
	)
}

export default React.memo(DateCellWrapper)
