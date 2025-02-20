import React from "react"
import { Box, Text } from "@/Components"
import { type DateCellWrapperProps } from "react-big-calendar"

const DateCellWrapper = ({ children, range, value }: DateCellWrapperProps) => {


	return (
		<Box className="rbc-date-cell" style={ { display: "flex", flexDirection: "column", height: "100%" } }>
			{ children }
			<Box>
				<Text size="xs" c="dimmed" style={ { marginTop: "auto", padding: "4px" } }>
					{ /* { totalHours.toFixed(1) }h */ }
					HIHIHI
				</Text>
			</Box>
		</Box>
	)
}

export default React.memo(DateCellWrapper)
