import clsx from "clsx"
import React from "react"
import { type DateCellWrapperProps } from "react-big-calendar"

import { Box, Text } from "@/Components"

import * as classes from "./Calendar.css"

const DateCellWrapper = ({ children, range, value }: DateCellWrapperProps) => {
	return (
		<Box className="rbc-date-cell" style={ { display: "flex", flexDirection: "column", height: "100%" } }>
			{ children }
			{ /* <Box className={ clsx(classes.shiftTotals) }>
				<Box>One</Box>
				<Box>Two</Box>
				<Box>Three</Box>
			</Box> */ }
		</Box>
	)
}

export default React.memo(DateCellWrapper)
