import React from "react"
import { Box } from "@/Components"
import { type DateCellWrapperProps } from "react-big-calendar"
// import NewShiftButton from "./NewShiftButton"
import { render } from "@testing-library/react"

const DateCellWrapper = ({ children, range, value }: DateCellWrapperProps) => {


	return (
		<Box className="rbc-date-cell">
			{ children }
			<Box>HI</Box>
		</Box>
	)
}

export default React.memo(DateCellWrapper)
