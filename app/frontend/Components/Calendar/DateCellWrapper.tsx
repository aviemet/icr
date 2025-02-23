import React from "react"
import { Box, Text } from "@/Components"
import { type DateCellWrapperProps } from "react-big-calendar"

import cx from "clsx"
import * as classes from "./Calendar.css"

const DateCellWrapper = ({ children, range, value }: DateCellWrapperProps) => {


	return (
		<Box className="rbc-date-cell" style={ { display: "flex", flexDirection: "column", height: "100%" } }>
			{ children }
			<Box className={ cx(classes.shiftTotals) }>
				<Box>One</Box>
				<Box>Two</Box>
				<Box>Three</Box>
			</Box>
		</Box>
	)
}

export default React.memo(DateCellWrapper)
